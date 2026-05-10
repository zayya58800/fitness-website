// ==================== 日期函数 ====================
function getTodayStr() {
    return new Date().toISOString().slice(0, 10);
}

// ==================== 训练记录 ====================
function getAllWorkouts() {
    let data = localStorage.getItem("fitness_workouts_detail");
    return data ? JSON.parse(data) : {};
}

function saveWorkout(dateStr, exercisesDone, totalCalories) {
    let allWorkouts = getAllWorkouts();
    allWorkouts[dateStr] = {
        date: dateStr,
        exercises: exercisesDone,
        totalCalories: totalCalories || 0,
        timestamp: new Date().getTime()
    };
    localStorage.setItem("fitness_workouts_detail", JSON.stringify(allWorkouts));
}

function getWorkoutByDate(dateStr) {
    let allWorkouts = getAllWorkouts();
    return allWorkouts[dateStr] || null;
}

function deleteWorkout(dateStr) {
    let allWorkouts = getAllWorkouts();
    delete allWorkouts[dateStr];
    localStorage.setItem("fitness_workouts_detail", JSON.stringify(allWorkouts));
}

// ==================== 跑步记录 ====================
function getAllRuns() {
    let data = localStorage.getItem("fitness_runs");
    return data ? JSON.parse(data) : {};
}

function saveRun(dateStr, km, calories) {
    let allRuns = getAllRuns();
    allRuns[dateStr] = { 
        date: dateStr, 
        km: km, 
        calories: calories, 
        timestamp: new Date().getTime() 
    };
    localStorage.setItem("fitness_runs", JSON.stringify(allRuns));
}

function getRunByDate(dateStr) {
    let allRuns = getAllRuns();
    return allRuns[dateStr] || null;
}

function deleteRun(dateStr) {
    let allRuns = getAllRuns();
    delete allRuns[dateStr];
    localStorage.setItem("fitness_runs", JSON.stringify(allRuns));
}

function updateRun(dateStr, km, calories) {
    saveRun(dateStr, km, calories);
}

// ==================== 体重记录（7天后自动清理） ====================
function getWeightLogs() {
    let logs = localStorage.getItem("fitness_weight_logs");
    let weights = logs ? JSON.parse(logs) : [];
    let sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    let filtered = weights.filter(w => new Date(w.date) >= sevenDaysAgo);
    if (filtered.length !== weights.length) {
        localStorage.setItem("fitness_weight_logs", JSON.stringify(filtered));
    }
    return filtered;
}

function saveWeight(weight, date) {
    let logs = getWeightLogs();
    let existing = logs.find(l => l.date === date);
    if (existing) {
        existing.weight = weight;
    } else {
        logs.push({ date, weight });
    }
    localStorage.setItem("fitness_weight_logs", JSON.stringify(logs));
}

// ==================== 食物摄入记录 ====================
function getTodayIntake() {
    let intake = JSON.parse(localStorage.getItem("daily_intake") || '[]');
    let today = getTodayStr();
    let todayIntake = intake.filter(i => i.date === today);
    return {
        calories: todayIntake.reduce((sum, i) => sum + i.calories, 0),
        protein: todayIntake.reduce((sum, i) => sum + i.protein, 0),
        items: todayIntake
    };
}

function addFoodIntake(foods) {
    let intake = JSON.parse(localStorage.getItem("daily_intake") || '[]');
    let today = getTodayStr();
    for (let food of foods) {
        intake.push({
            date: today,
            name: food.name,
            quantity: food.quantity,
            unit: food.unit,
            calories: food.calories,
            protein: food.protein,
            time: new Date().toLocaleTimeString()
        });
    }
    localStorage.setItem("daily_intake", JSON.stringify(intake));
}

function deleteFoodIntake(index) {
    let intake = JSON.parse(localStorage.getItem("daily_intake") || '[]');
    let today = getTodayStr();
    let todayItems = intake.filter(i => i.date === today);
    if (todayItems[index]) {
        let globalIndex = intake.findIndex(i => i.date === today && i.time === todayItems[index].time && i.name === todayItems[index].name);
        if (globalIndex !== -1) intake.splice(globalIndex, 1);
        localStorage.setItem("daily_intake", JSON.stringify(intake));
    }
}

function clearTodayIntake() {
    let intake = JSON.parse(localStorage.getItem("daily_intake") || '[]');
    let today = getTodayStr();
    let newIntake = intake.filter(i => i.date !== today);
    localStorage.setItem("daily_intake", JSON.stringify(newIntake));
}

// ==================== 今日消耗计算 ====================
function getTodayExpenditure() {
    let todayRun = getRunByDate(getTodayStr());
    let todayWorkout = getWorkoutByDate(getTodayStr());
    let runCalories = todayRun ? todayRun.calories : 0;
    let workoutCalories = todayWorkout ? todayWorkout.totalCalories : 0;
    return {
        total: runCalories + workoutCalories,
        run: runCalories,
        workout: workoutCalories
    };
}

// ==================== 每日推荐 ====================
function getDailyRecommendation() {
    const day = new Date().getDay();
    const map = {
        1: ["胸部", "手臂(三头)"],
        2: ["背部", "手臂(二头)"],
        3: ["大腿前侧", "大腿后侧", "臀部"],
        4: ["肩膀", "腹部"],
        5: ["手臂(二头)", "手臂(三头)"],
        6: ["胸部", "背部"],
        0: ["腹部", "小腿"]
    };
    return map[day] || ["胸部"];
}

// ==================== 30天日历 ====================
function generate30DayCalendar() {
    let calendar = [];
    let today = new Date();
    let startDate = new Date();
    startDate.setDate(today.getDate() - 29);

    for (let i = 0; i < 30; i++) {
        let date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        let dateStr = date.toISOString().slice(0, 10);
        calendar.push({
            date: date,
            dateStr: dateStr,
            isToday: dateStr === getTodayStr(),
            day: date.getDate(),
            month: date.getMonth() + 1
        });
    }
    return calendar;
}

// ==================== 最近30天跑步统计 ====================
function getLast30DaysRuns() {
    let allRuns = getAllRuns();
    let last30Days = [];
    let today = new Date();
    for (let i = 29; i >= 0; i--) {
        let d = new Date();
        d.setDate(today.getDate() - i);
        let ds = d.toISOString().slice(0, 10);
        let run = allRuns[ds];
        if (run) {
            last30Days.push(run);
        }
    }
    return last30Days;
}

// ==================== 最近7天热量总结 ====================
function getLast7DaysHeatSummary() {
    let summary = [];
    let today = new Date();
    for (let i = 6; i >= 0; i--) {
        let d = new Date();
        d.setDate(today.getDate() - i);
        let ds = d.toISOString().slice(0, 10);
        
        let workout = getWorkoutByDate(ds);
        let run = getRunByDate(ds);
        let intake = JSON.parse(localStorage.getItem("daily_intake") || '[]');
        let dayIntake = intake.filter(item => item.date === ds);
        let intakeCalories = dayIntake.reduce((sum, item) => sum + item.calories, 0);
        let workoutCalories = workout ? workout.totalCalories : 0;
        let runCalories = run ? run.calories : 0;
        let totalExpenditure = workoutCalories + runCalories;
        let netCalories = intakeCalories - totalExpenditure;
        
        // 计算净热量状态
        let status = "";
        let statusColor = "";
        if (netCalories < -300) {
            status = "🔥 大亏空";
            statusColor = "#00E5B2";
        } else if (netCalories < 0) {
            status = "📉 小亏空";
            statusColor = "#88DD88";
        } else if (netCalories > 300) {
            status = "⚠️ 超标的";
            statusColor = "#FF8888";
        } else if (netCalories > 0) {
            status = "📈 有盈余";
            statusColor = "#FFAA44";
        } else {
            status = "⚖️ 平衡的";
            statusColor = "#FFD700";
        }
        
        summary.push({
            date: ds,
            displayDate: `${d.getMonth()+1}/${d.getDate()}`,
            intake: intakeCalories,
            expenditure: totalExpenditure,
            workout: workoutCalories,
            run: runCalories,
            net: netCalories,
            status: status,
            statusColor: statusColor,
            hasWorkout: !!workout,
            hasRun: !!run
        });
    }
    return summary;
}

// ==================== 体脂率计算器 ====================
function calculateBodyFat(weight, waist, neck, height, gender) {
    // 使用美国海军方法计算体脂率
    if (gender === "male") {
        // 男性：86.010 * log10(腰围 - 颈围) - 70.041 * log10(身高) + 36.76
        let bodyFat = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
        return Math.max(5, Math.min(40, Math.round(bodyFat * 10) / 10));
    } else {
        // 女性：163.205 * log10(腰围 + 臀围 - 颈围) - 97.684 * log10(身高) - 78.387
        let hips = waist * 1.1; // 简化，实际需要测量臀围
        let bodyFat = 163.205 * Math.log10(waist + hips - neck) - 97.684 * Math.log10(height) - 78.387;
        return Math.max(10, Math.min(45, Math.round(bodyFat * 10) / 10));
    }
}

function getBodyFatStatus(bodyFat, gender) {
    if (gender === "male") {
        if (bodyFat < 6) return { text: "极低 (专业健美)", color: "#00D4FF", suggestion: "注意健康，不要太低" };
        if (bodyFat < 10) return { text: "优秀 (肌肉清晰)", color: "#00E5B2", suggestion: "保持现状" };
        if (bodyFat < 15) return { text: "良好 (隐约腹肌)", color: "#88DD88", suggestion: "继续努力" };
        if (bodyFat < 20) return { text: "标准 (正常范围)", color: "#FFD700", suggestion: "适当减脂" };
        if (bodyFat < 25) return { text: "偏高 (需要减脂)", color: "#FFAA44", suggestion: "加强有氧和控制饮食" };
        return { text: "过高 (建议减脂)", color: "#FF8888", suggestion: "建议咨询专业人士" };
    } else {
        if (bodyFat < 14) return { text: "极低 (专业选手)", color: "#00D4FF", suggestion: "注意健康" };
        if (bodyFat < 18) return { text: "优秀 (线条清晰)", color: "#00E5B2", suggestion: "保持现状" };
        if (bodyFat < 22) return { text: "良好 (健康范围)", color: "#88DD88", suggestion: "继续保持" };
        if (bodyFat < 27) return { text: "标准 (正常范围)", color: "#FFD700", suggestion: "适当减脂" };
        if (bodyFat < 32) return { text: "偏高", color: "#FFAA44", suggestion: "加强运动" };
        return { text: "过高", color: "#FF8888", suggestion: "建议咨询专业人士" };
    }
}
// ==================== 营养计算函数 ====================
function calculateBMR(weight, height, age, gender) {
    if (gender === "male") {
        return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        return 10 * weight + 6.25 * height - 5 * age - 161;
    }
}

function calculateTDEE(bmr, activityLevel) {
    const multipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        veryActive: 1.9
    };
    return bmr * (multipliers[activityLevel] || 1.2);
}

function getCutCalories(tdee) {
    return tdee - 500;
}

function getBulkCalories(tdee) {
    return tdee + 250;
}

function getProteinRecommendation(weight, goal) {
    if (goal === "cut") {
        return weight * 2.2;
    } else if (goal === "bulk") {
        return weight * 1.8;
    } else {
        return weight * 1.5;
    }
}

function calculateRunningCalories(km, weight) {
    return Math.round(km * weight * 0.8);
}

// ==================== 年度总结 ====================
function getYearSummary() {
    let data = localStorage.getItem("fitness_year_summary");
    return data ? JSON.parse(data) : {
        startWeight: null,
        startDate: null,
        currentWeight: null,
        startBodyFat: null,
        currentBodyFat: null,
        photos: [],
        notes: ""
    };
}

function saveYearSummary(summary) {
    localStorage.setItem("fitness_year_summary", JSON.stringify(summary));
}

function addProgressPhoto(imageData) {
    let summary = getYearSummary();
    summary.photos.push({
        id: Date.now(),
        data: imageData,
        date: getTodayStr(),
        caption: ""
    });
    saveYearSummary(summary);
}

function deleteProgressPhoto(photoId) {
    let summary = getYearSummary();
    summary.photos = summary.photos.filter(p => p.id !== photoId);
    saveYearSummary(summary);
}

// ==================== 评论 ====================
function getComments() {
    let data = localStorage.getItem("fitness_comments");
    return data ? JSON.parse(data) : [];
}

function saveComment(name, comment) {
    let comments = getComments();
    comments.push({
        id: Date.now(),
        name: name || "匿名用户",
        comment: comment,
        time: new Date().toLocaleString()
    });
    localStorage.setItem("fitness_comments", JSON.stringify(comments));
}

// ==================== BMI计算 ====================
function calculateBMI(weight, height) {
    let bmi = weight / ((height / 100) ** 2);
    let status = "";
    if (bmi < 18.5) status = "体重过轻";
    else if (bmi < 24) status = "正常范围";
    else if (bmi < 27) status = "过重";
    else if (bmi < 30) status = "轻度肥胖";
    else if (bmi < 35) status = "中度肥胖";
    else status = "重度肥胖";
    return { bmi: bmi.toFixed(1), status: status };
}

// ==================== 体脂率评估 ====================
function evaluateBodyFat(bodyFat, gender) {
    if (gender === "male") {
        if (bodyFat < 6) return "极低 (肌肉线条非常清晰)";
        if (bodyFat < 10) return "低 (肌肉线条清晰)";
        if (bodyFat < 15) return "标准 (隐约可见腹肌)";
        if (bodyFat < 20) return "偏高 (肌肉线条不明显)";
        if (bodyFat < 25) return "高 (需要减脂)";
        return "过高 (建议减脂)";
    } else {
        if (bodyFat < 14) return "极低 (专业运动员)";
        if (bodyFat < 18) return "低 (肌肉线条清晰)";
        if (bodyFat < 22) return "标准 (健康范围)";
        if (bodyFat < 27) return "偏高";
        if (bodyFat < 32) return "高";
        return "过高";
    }
}

// ==================== 定位功能 ====================
let startLocation = null;

function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        timestamp: position.timestamp
                    });
                },
                (error) => {
                    reject(error);
                }
            );
        } else {
            reject(new Error("浏览器不支持定位"));
        }
    });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

async function startRunTracking() {
    try {
        startLocation = await getCurrentLocation();
        return { success: true, message: "开始记录跑步，结束时会计算距离" };
    } catch (err) {
        return { success: false, message: "无法获取定位: " + err.message };
    }
}

async function endRunTracking() {
    if (!startLocation) {
        return { success: false, message: "请先开始记录跑步" };
    }
    try {
        let endLocation = await getCurrentLocation();
        let distanceMeters = calculateDistance(
            startLocation.lat, startLocation.lng,
            endLocation.lat, endLocation.lng
        );
        let distanceKm = distanceMeters / 1000;
        startLocation = null;
        return { success: true, km: distanceKm, message: `跑步距离: ${distanceKm.toFixed(2)} 公里` };
    } catch (err) {
        return { success: false, message: "无法获取结束位置: " + err.message };
    }
}
// ==================== 每月身体变化记录 ====================
function getMonthlyBodyChanges() {
    let data = localStorage.getItem("fitness_monthly_changes");
    return data ? JSON.parse(data) : [];
}

function saveMonthlyRecord(month, weight, bodyFat, waist, muscle, notes) {
    let records = getMonthlyBodyChanges();
    let existingIndex = records.findIndex(r => r.month === month);
    let record = {
        month: month,
        weight: weight || null,
        bodyFat: bodyFat || null,
        waist: waist || null,
        muscle: muscle || null,
        notes: notes || "",
        timestamp: new Date().getTime()
    };
    
    if (existingIndex !== -1) {
        records[existingIndex] = record;
    } else {
        records.push(record);
    }
    localStorage.setItem("fitness_monthly_changes", JSON.stringify(records));
}

function deleteMonthlyRecord(month) {
    let records = getMonthlyBodyChanges();
    records = records.filter(r => r.month !== month);
    localStorage.setItem("fitness_monthly_changes", JSON.stringify(records));
}

function getPreviousMonth(monthStr) {
    let [year, month] = monthStr.split('-');
    let date = new Date(parseInt(year), parseInt(month) - 2, 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// ==================== 肌肉量估算 ====================
function estimateMuscleMass(weight, bodyFat, gender, fitnessLevel) {
    // 去脂体重
    let leanMass = weight * (1 - bodyFat / 100);
    
    // 根据性别和训练水平估算肌肉占比（去脂体重中肌肉的比例）
    let muscleRatio;
    if (gender === "male") {
        switch(fitnessLevel) {
            case "beginner": muscleRatio = 0.48; break;
            case "intermediate": muscleRatio = 0.52; break;
            case "advanced": muscleRatio = 0.56; break;
            default: muscleRatio = 0.52;
        }
    } else {
        switch(fitnessLevel) {
            case "beginner": muscleRatio = 0.44; break;
            case "intermediate": muscleRatio = 0.48; break;
            case "advanced": muscleRatio = 0.52; break;
            default: muscleRatio = 0.48;
        }
    }
    
    let muscleMass = leanMass * muscleRatio;
    return Math.round(muscleMass * 10) / 10;
}

// 根据体脂率和性别评估肌肉量水平
function evaluateMuscleMass(muscleMass, weight, gender) {
    let musclePercentage = (muscleMass / weight * 100).toFixed(1);
    
    if (gender === "male") {
        if (musclePercentage >= 45) return { text: "优秀 💪", color: "#00E5B2", suggestion: "肌肉量很好，继续保持！" };
        if (musclePercentage >= 40) return { text: "良好 👍", color: "#88DD88", suggestion: "继续努力，增加力量训练" };
        if (musclePercentage >= 35) return { text: "标准 ⚖️", color: "#FFD700", suggestion: "建议增加蛋白质摄入和力量训练" };
        return { text: "偏低 📉", color: "#FFAA44", suggestion: "需要加强力量训练和蛋白质补充" };
    } else {
        if (musclePercentage >= 38) return { text: "优秀 💪", color: "#00E5B2", suggestion: "肌肉量很好，继续保持！" };
        if (musclePercentage >= 34) return { text: "良好 👍", color: "#88DD88", suggestion: "继续努力，增加力量训练" };
        if (musclePercentage >= 30) return { text: "标准 ⚖️", color: "#FFD700", suggestion: "建议增加蛋白质摄入和力量训练" };
        return { text: "偏低 📉", color: "#FFAA44", suggestion: "需要加强力量训练和蛋白质补充" };
    }
}

// 训练水平选择对应的值
const FITNESS_LEVELS = {
    beginner: "初级 (健身<6个月)",
    intermediate: "中级 (健身6个月-2年)",
    advanced: "高级 (健身>2年)"
};
