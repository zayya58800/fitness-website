// ==================== 全局变量 ====================
let currentExercises = [];
let currentSelectedMuscles = [];
let currentNutritionTab = "weightLoss";
let isTracking = false;

// ==================== 页面渲染函数 ====================
function renderHome() {
    const recMuscles = getDailyRecommendation();
    const logs = getWeightLogs();
    const todayIntake = getTodayIntake();
    const todayExpenditure = getTodayExpenditure();
    const netCalories = todayIntake.calories - todayExpenditure.total;
    const weightHtml = logs.slice(-3).map(l => `<div>${l.date}: ${l.weight} kg</div>`).join('') || '还未记录体重';
    const todayRun = getRunByDate(getTodayStr());
    
    let netClass = "", netText = "";
    if (netCalories < -300) {
        netClass = "summary-deficit";
        netText = `🔥 热量亏空 ${-netCalories} 大卡 (减脂中)`;
    } else if (netCalories < 0) {
        netClass = "summary-deficit";
        netText = `🔥 热量亏空 ${-netCalories} 大卡`;
    } else if (netCalories > 300) {
        netClass = "summary-surplus";
        netText = `⚠️ 热量盈余 ${netCalories} 大卡 (超标)`;
    } else if (netCalories > 0) {
        netClass = "summary-surplus";
        netText = `📈 热量盈余 ${netCalories} 大卡`;
    } else {
        netClass = "summary-balanced";
        netText = `⚖️ 热量平衡`;
    }
    
    return `
        <div class="page-title">
            今天
            <small>${new Date().toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })}</small>
        </div>
        <div class="container">
            <div class="summary-card">
                <h3>📊 今日热量总结</h3>
                <p>🍽️ 摄入: ${todayIntake.calories} 大卡</p>
                <p>🏃 消耗: ${todayExpenditure.total} 大卡</p>
                <p class="${netClass}">${netText}</p>
            </div>
            
            <div class="card">
                <h2>📊 BMI计算器</h2>
                <div class="form-row">
                    <input type="number" id="bmiHeight" placeholder="身高 (cm)" step="1">
                    <input type="number" id="bmiWeight" placeholder="体重 (kg)" step="0.1">
                    <button class="btn btn-small" id="calcBmiBtn">计算BMI</button>
                </div>
                <div id="bmiResult"></div>
            </div>
            
            <div class="card">
                <h2>💪 今天练什么？</h2>
                <p style="color: #00D4FF; font-size: 1.2rem;">推荐训练: ${recMuscles.join(' · ')}</p>
                <button class="btn" id="startTrainBtn">⚡ 开始今日训练</button>
            </div>
            
            <div class="card">
                <h2>🏃 今日跑步</h2>
                ${todayRun ? `<p style="color:#00E5B2">✅ 今日已跑 ${todayRun.km} 公里，消耗 ${todayRun.calories} 大卡</p>` : '<p style="color:#aaa">今日还没有跑步记录</p>'}
                <button class="btn btn-outline" id="goCardioBtn">🏃 去跑步打卡</button>
            </div>
            
            <h3>🎯 选择训练部位 (可多选)</h3>
            <div class="muscle-grid" id="muscleGridHome">
                ${MUSCLES_SIMPLE.map(m => `<div class="muscle-chip" data-muscle="${m}">${m}</div>`).join('')}
            </div>
            
            <div class="card">
                <h4>📊 最近体重 (7天)</h4>
                <div id="weightPreview">${weightHtml}</div>
            </div>
            
            <div class="card">
                <h3>📏 体脂率计算器</h3>
                <p style="color:#aaa; font-size:0.8rem;">📌 使用美国海军方法估算，腰围测量肚脐位置</p>
                <div class="form-row">
                    <input type="number" id="bfHomeWeight" placeholder="体重 (kg)" step="0.1">
                    <input type="number" id="bfHomeWaist" placeholder="腰围 (cm)" step="0.1">
                    <input type="number" id="bfHomeNeck" placeholder="颈围 (cm)" step="0.1">
                    <input type="number" id="bfHomeHeight" placeholder="身高 (cm)" step="1">
                </div>
                <select id="bfHomeGender">
                    <option value="male">男性</option>
                    <option value="female">女性</option>
                </select>
                <button class="btn" id="calcHomeBodyFatBtn">📊 计算体脂率</button>
                <div id="homeBodyFatResult"></div>
            </div>
        </div>
    `;
}

function renderTrainPage() {
    const defaultMuscles = getDailyRecommendation();
    currentSelectedMuscles = [...defaultMuscles];
    
    return `
        <div class="page-title">
            今日训练
            <small>选择部位，生成计划 💪</small>
        </div>
        <div class="container">
            <div class="card">
                <div class="card-title">🏋️ 选择训练部位</div>
                <div class="muscle-grid" id="trainMuscleSelector">
                    ${MUSCLES_SIMPLE.map(m => `
                        <div class="muscle-chip ${currentSelectedMuscles.includes(m) ? 'selected' : ''}" data-muscle="${m}">${m}</div>
                    `).join('')}
                </div>
                <button class="btn" id="generatePlanBtn">✨ 生成训练计划</button>
                <div id="planContainer"></div>
                <button class="btn btn-outline" id="completeWorkoutBtn" style="margin-top: 1rem;">✅ 完成训练并打卡</button>
            </div>
            <div class="card">
                <h3>📋 今日已完成训练</h3>
                <div id="todayWorkoutSummary">加载中...</div>
            </div>
        </div>
    `;
}

function updatePlanUI(musclesArray) {
    currentSelectedMuscles = musclesArray;
    const exercises = getExercisesForMuscles(musclesArray);
    currentExercises = exercises;
    const container = document.getElementById('planContainer');
    if (!container) return;
    
    if (exercises.length === 0) {
        container.innerHTML = `<div class="card">⚠️ 没有找到动作，试试选别的部位</div>`;
        return;
    }
    
    let totalEstimatedCalories = exercises.reduce((sum, ex) => sum + (ex.caloriesPerSet * ex.sets), 0);
    
    let html = `<p style="margin-bottom: 1rem; color: #00D4FF;">共 ${exercises.length} 个动作，预计消耗约 ${totalEstimatedCalories} 大卡</p>`;
    html += `<div style="max-height: 500px; overflow-y: auto;">`;
    exercises.forEach((ex, idx) => {
        html += `
            <div class="exercise-item">
                <input type="checkbox" class="checkbox-custom" id="ex_${idx}" data-calories="${ex.caloriesPerSet * ex.sets}">
                <div style="flex:1">
                    <div class="exercise-name">
                        🏋️ ${ex.name}
                        <span class="equipment-badge">${ex.equipment}</span>
                        <a href="${ex.youtube}" target="_blank" class="youtube-link" style="margin-left: 8px;">🔍 搜索视频</a>
                    </div>
                    <div class="exercise-detail">📌 ${ex.sets}组 × ${ex.reps} · 休息${ex.rest}秒 · 约${ex.caloriesPerSet * ex.sets}大卡</div>
                    <div class="exercise-detail">📖 ${ex.instruction}</div>
                </div>
            </div>
        `;
    });
    html += `</div>`;
    container.innerHTML = html;
    loadTodayCompletedExercises();
}

function loadTodayCompletedExercises() {
    let todayWorkout = getWorkoutByDate(getTodayStr());
    if (todayWorkout && todayWorkout.exercises) {
        let completedNames = todayWorkout.exercises.map(e => e.name);
        for (let i = 0; i < currentExercises.length; i++) {
            let chk = document.getElementById(`ex_${i}`);
            if (chk && completedNames.includes(currentExercises[i].name)) {
                chk.checked = true;
            }
        }
    }
    updateTodayWorkoutSummary();
}

function updateTodayWorkoutSummary() {
    let container = document.getElementById('todayWorkoutSummary');
    if (!container) return;
    let todayWorkout = getWorkoutByDate(getTodayStr());
    if (!todayWorkout || !todayWorkout.exercises || todayWorkout.exercises.length === 0) {
        container.innerHTML = `<p style="color:#aaa">今天还没有完成训练，快开始吧！💪</p>`;
        return;
    }
    let exercises = todayWorkout.exercises;
    let html = `<div style="background:#0E1428; border-radius:16px; padding:1rem;">`;
    html += `<p style="color:#00E5B2">✅ 今日已完成 ${exercises.length} 个动作，消耗 ${todayWorkout.totalCalories || 0} 大卡</p>`;
    exercises.forEach(ex => {
        html += `<div style="margin:8px 0">• ${ex.name} · ${ex.sets}组 × ${ex.reps} · ${ex.calories}大卡</div>`;
    });
    html += `<button class="btn-small btn-danger" id="deleteTodayWorkoutBtn" style="margin-top:10px;">🗑️ 删除今日训练记录</button>`;
    html += `</div>`;
    container.innerHTML = html;
    
    document.getElementById('deleteTodayWorkoutBtn')?.addEventListener('click', () => {
        if (confirm("确定删除今天的训练记录吗？")) {
            deleteWorkout(getTodayStr());
            updateTodayWorkoutSummary();
            alert("已删除今日训练记录");
        }
    });
}

function completeWorkout() {
    let completedExercises = [];
    let totalCalories = 0;
    for (let i = 0; i < currentExercises.length; i++) {
        let chk = document.getElementById(`ex_${i}`);
        if (chk && chk.checked) {
            let calories = currentExercises[i].caloriesPerSet * currentExercises[i].sets;
            totalCalories += calories;
            completedExercises.push({
                name: currentExercises[i].name,
                target: "组合训练",
                sets: currentExercises[i].sets,
                reps: currentExercises[i].reps,
                calories: calories
            });
        }
    }
    if (completedExercises.length === 0) {
        alert("请至少勾选一个完成的动作再打卡");
        return;
    }
    let today = getTodayStr();
    saveWorkout(today, completedExercises, totalCalories);
    alert(`✅ 训练打卡完成！\n完成了 ${completedExercises.length} 个动作，消耗 ${totalCalories} 大卡！`);
    updateTodayWorkoutSummary();
}

function renderCardioPage() {
    const todayRun = getRunByDate(getTodayStr());
    const last30DaysRuns = getLast30DaysRuns();
    const weightLogs = getWeightLogs();
    const currentWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : 70;
    const totalKm30 = last30DaysRuns.reduce((sum, r) => sum + r.km, 0);
    const totalCal30 = last30DaysRuns.reduce((sum, r) => sum + r.calories, 0);
    
    let runsListHtml = last30DaysRuns.slice().reverse().map(r => `
        <div class="run-item" data-date="${r.date}">
            <span>📅 ${r.date} · ${r.km}公里 · ${r.calories}大卡</span>
            <div class="run-actions">
                <button class="edit-run" data-date="${r.date}" data-km="${r.km}" data-cal="${r.calories}">✏️ 编辑</button>
                <button class="delete-run" data-date="${r.date}">🗑️ 删除</button>
            </div>
        </div>
    `).join('');
    
    return `
        <div class="page-title">
            跑步打卡
            <small>记录每一次奔跑 🏃</small>
        </div>
        <div class="container">
            <div class="card">
                <div class="card-title">📝 记录今日跑步</div>
                ${todayRun ? `<p style="color:#00E5B2">今日已打卡: ${todayRun.km} 公里，消耗 ${todayRun.calories} 大卡</p>` : ''}
                
                <div class="location-btn" id="startLocationBtn">
                    📍 开始GPS定位记录跑步
                </div>
                <div class="location-btn" id="endLocationBtn" style="display:none;">
                    🏁 结束GPS记录跑步
                </div>
                <div id="gpsStatus" style="color:#aaa; margin: 0.5rem 0;"></div>
                
                <hr style="margin: 1rem 0; border-color:#2A3655;">
                
                <input type="number" id="runKm" placeholder="或手动输入跑步距离 (公里)" step="0.1">
                <div id="runCaloriesPreview" style="color:#aaa; margin: 0.5rem 0;"></div>
                <button class="btn" id="saveRunBtn">✅ 保存跑步记录</button>
            </div>
            <div class="card">
                <h3>📊 最近30天跑步统计</h3>
                <p>总距离: ${totalKm30.toFixed(1)} 公里</p>
                <p>总消耗: ${totalCal30} 大卡</p>
                <p>平均每天: ${(totalKm30/30).toFixed(1)} 公里</p>
                <div id="recentRunsList" style="max-height: 300px; overflow-y: auto; margin-top: 1rem;">
                    ${runsListHtml || '暂无记录'}
                </div>
            </div>
        </div>
    `;
}

function renderNutritionPage() {
    const todayIntake = getTodayIntake();
    
    return `
        <div class="page-title">
            饮食营养
            <small>精准计算每日营养 🥗</small>
        </div>
        <div class="container">
            <div class="card">
                <div class="card-title">🔥 选择你的目标</div>
                    <button class="tab-btn ${currentNutritionTab === 'weightLoss' ? 'active' : ''}" data-tab="weightLoss">🔥 减脂人士</button>
                    <button class="tab-btn ${currentNutritionTab === 'muscleGain' ? 'active' : ''}" data-tab="muscleGain">💪 健身增肌人士</button>
                    <button class="tab-btn ${currentNutritionTab === 'healthy' ? 'active' : ''}" data-tab="healthy">🌿 健康维持人士</button>
                </div>
                
                <div class="form-row">
                    <input type="number" id="nutriWeight" placeholder="体重 (kg)" step="0.1">
                    <input type="number" id="nutriHeight" placeholder="身高 (cm)" step="1">
                    <input type="number" id="nutriAge" placeholder="年龄" step="1">
                </div>
                <select id="nutriGender">
                    <option value="male">男性</option>
                    <option value="female">女性</option>
                </select>
                <select id="nutriActivity">
                    <option value="sedentary">久坐 (很少运动)</option>
                    <option value="light">轻度活动 (每周1-2次)</option>
                    <option value="moderate">中度活动 (每周3-5次)</option>
                    <option value="active">高度活动 (每周6-7次)</option>
                    <option value="veryActive">极度活动 (每天高强度)</option>
                </select>
                <button class="btn" id="calculateNutritionBtn">计算每日营养需求</button>
                <div id="nutritionResult"></div>
            </div>
            
            <div class="card">
                <h3>🍎 食物热量/蛋白质查询</h3>
                <input type="text" id="foodSearchInput" placeholder="搜索食物 (如: 鸡胸肉, 鸡蛋...)" onkeyup="searchFoods()">
                <div id="foodResults" style="max-height: 300px; overflow-y: auto; margin-top: 1rem;">
                    ${FOOD_DATABASE.map(food => `
                        <div class="food-item">
                            <input type="checkbox" class="food-checkbox" data-name="${food.name}" data-base="${food.baseAmount}" data-unit="${food.unit}" data-cal="${food.caloriesPerUnit}" data-protein="${food.proteinPerUnit}" data-type="${food.type}">
                            <span class="food-name">${food.name}</span>
                            <input type="number" class="quantity-input" placeholder="数量 (${food.unit})" value="1" min="0.1" step="0.1">
                            <span class="food-calories">🔥 ${food.caloriesPerUnit}大卡/${food.baseAmount}${food.unit} · 💪 ${food.proteinPerUnit}g蛋白</span>
                        </div>
                    `).join('')}
                </div>
                <button class="btn" id="addSelectedFoodsBtn">➕ 添加选中的食物</button>
                
                <div id="selectedFoods" style="margin-top: 1rem;">
                    <h4>📝 今日摄入记录</h4>
                    <div id="dailyIntakeList"></div>
                    <div id="dailyTotal" style="margin-top: 0.5rem; padding: 0.5rem; background: #0E1428; border-radius: 12px;"></div>
                    <button class="btn-small btn-danger" id="clearTodayIntakeBtn">🗑️ 清空今日记录</button>
                </div>
            </div>
        </div>
    `;
}

function renderLibrary() {
    let accordions = '';
    for (let muscle of MUSCLES_SIMPLE) {
        let exList = WORKOUT_PLANS[muscle];
        if (!exList) continue;
        accordions += `
            <div class="accordion">
                <div class="accordion-header">💪 ${muscle} (${exList.length}个动作) <span style="float:right">▼</span></div>
                <div class="accordion-content">
                    ${exList.map(ex => `
                        <div style="border-bottom:1px solid #2A3655; padding:0.8rem 0">
                            <strong>${ex.name}</strong> 
                            <span class="equipment-badge">${ex.equipment}</span>
                            <br><span style="color:#aaa">${ex.instruction}</span>
                            <br><small>${ex.sets}组 × ${ex.reps} · 休息${ex.rest}秒 · 约${ex.caloriesPerSet * ex.sets}大卡</small>
                            <br><a href="${ex.youtube}" target="_blank" class="youtube-link">🔍 搜索视频教程</a>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    return `<div class="page-title">
            动作库
            <small>全身肌肉训练大全 📚</small>
        </div>
        <div class="container">${accordions}</div>`;
}

function renderProgress() {
    const logs = getWeightLogs();
    const calendar30 = generate30DayCalendar();
    const heatSummary = getLast7DaysHeatSummary();
    
    // 7天热量总结 - 美化版
    let heatHtml = `<div style="display: flex; flex-direction: column; gap: 12px;">`;
    for (let day of heatSummary) {
        let barWidth = Math.min(100, Math.abs(day.net) / 50);
        let barColor = day.net < 0 ? '#00E5B2' : (day.net > 100 ? '#FF8888' : '#FFD700');
        let netText = day.net < 0 ? `🔥 ${-day.net} 大卡` : (day.net > 0 ? `📈 ${day.net} 大卡` : `⚖️ 0 大卡`);
        
        heatHtml += `
            <div style="background: #1A2235; border-radius: 16px; padding: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-weight: bold; color: #00D4FF;">📅 ${day.displayDate}</span>
                    <span style="color: #aaa;">🍽️ ${day.intake} / 🏃 ${day.expenditure}</span>
                    <span style="color: ${day.statusColor};">${netText}</span>
                </div>
                <div style="background: #0E1428; border-radius: 12px; overflow: hidden; height: 8px;">
                    <div style="width: ${barWidth}%; background: ${barColor}; height: 100%;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 6px; font-size: 0.7rem;">
                    <span>摄入 ${day.intake}大卡</span>
                    <span>消耗 ${day.expenditure}大卡</span>
                </div>
            </div>
        `;
    }
    heatHtml += `</div>`;
    
    // 30天日历
    let calendarHtml = `<div class="calendar-grid">`;
    const weekdays = ['一', '二', '三', '四', '五', '六', '日'];
    calendarHtml += weekdays.map(d => `<div style="color:#00D4FF; font-size:0.7rem; text-align:center;">${d}</div>`).join('');
    
    for (let day of calendar30) {
        let workout = getWorkoutByDate(day.dateStr);
        let run = getRunByDate(day.dateStr);
        let hasActivity = workout || run;
        let summary = '';
        if (workout) summary += `💪 ${workout.totalCalories}大卡 `;
        if (run) summary += `🏃 ${run.calories}大卡`;
        let classes = `cal-day ${hasActivity ? 'has-workout' : ''} ${day.isToday ? 'today' : ''}`;
        calendarHtml += `<div class="${classes}">
            ${day.date.getDate()}
            ${hasActivity ? '<div class="workout-summary">' + summary + '</div>' : ''}
        </div>`;
    }
    calendarHtml += `</div>`;
    
    let weightHtml = logs.slice(-7).reverse().map(l => `<div>${l.date} → ${l.weight} kg</div>`).join('') || '暂无记录';
    
    return `
        <div class="page-title">
            我的进度
            <small>追踪每一天的成长 📈</small>
        </div>
        <div class="container">
            
            <div class="card">
                <h3>🔥 7天热量总结</h3>
                <p style="color:#aaa; font-size:0.8rem; margin-bottom:1rem;">📊 绿色=亏空(减脂) · 黄色=平衡 · 红色=盈余(增肌)</p>
                ${heatHtml}
            </div>
            
            <div class="card">
                <h3>⚖️ 记录体重</h3>
                <input type="number" id="weightInput" step="0.1" placeholder="今天体重 (kg)" />
                <button class="btn" id="saveWeightBtn">💾 保存体重</button>
                <h4 style="margin-top:1rem">最近7天体重记录</h4>
                ${weightHtml}
            </div>
            
            <div class="card">
                <h3>🗓️ 30天训练日历</h3>
                <p style="color:#aaa; font-size:0.8rem">🟢 绿色 = 有训练/跑步 · 鼠标悬停看详情</p>
                ${calendarHtml}
            </div>
        </div>
    `;
}

function renderYearSummaryPage() {
    let summary = getYearSummary();
    let currentMonth = new Date().getMonth() + 1;
    let weightChange = summary.startWeight && summary.currentWeight ? (summary.currentWeight - summary.startWeight).toFixed(1) : null;
    let bodyFatChange = summary.startBodyFat && summary.currentBodyFat ? (summary.currentBodyFat - summary.startBodyFat).toFixed(1) : null;
    
    // 获取每月变化数据
    let monthlyData = getMonthlyBodyChanges();
    
    let photosHtml = summary.photos.map(p => `
        <div style="display:inline-block; margin:10px; text-align:center;">
            <img src="${p.data}" class="progress-photo" style="max-width:200px;">
            <br><small>${p.date}</small>
            <button class="btn-small btn-danger" onclick="deleteProgressPhoto(${p.id})">删除</button>
        </div>
    `).join('');
    
    // 每月身体变化表单
    let currentYearMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    let currentMonthData = monthlyData.find(m => m.month === currentYearMonth) || { month: currentYearMonth, weight: '', bodyFat: '', waist: '', muscle: '', notes: '' };
    
    let monthlyFormHtml = `
        <div class="card">
            <h3>📝 每月身体变化记录</h3>
            <p style="color:#aaa; font-size:0.8rem;">记录每个月的身体数据，追踪你的进步！</p>
            <div class="form-row">
                <input type="month" id="recordMonth" value="${currentYearMonth}">
            </div>
            <div class="form-row">
                <input type="number" id="monthWeight" placeholder="体重 (kg)" value="${currentMonthData.weight || ''}" step="0.1">
                <input type="number" id="monthBodyFat" placeholder="体脂率 (%)" value="${currentMonthData.bodyFat || ''}" step="0.1">
                <input type="number" id="monthWaist" placeholder="腰围 (cm)" value="${currentMonthData.waist || ''}" step="0.1">
                <input type="number" id="monthMuscle" placeholder="肌肉量 (kg) 可选" value="${currentMonthData.muscle || ''}" step="0.1">
            </div>
            
            <!-- 肌肉量估算工具 -->
            <div style="background: #0E1428; border-radius: 12px; padding: 12px; margin: 10px 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                    <span style="color: #00D4FF;">📊 肌肉量估算器</span>
                    <select id="fitnessLevelSelect" style="width: auto; padding: 5px 10px;">
                        <option value="beginner">初级 (健身<6个月)</option>
                        <option value="intermediate">中级 (健身6个月-2年)</option>
                        <option value="advanced">高级 (健身>2年)</option>
                    </select>
                    <button class="btn-small" id="estimateMuscleBtn" style="padding: 5px 12px;">🔢 估算肌肉量</button>
                </div>
                <div id="muscleEstimateResult" style="font-size: 0.8rem; margin-top: 8px; color: #aaa;"></div>
            </div>
            
            <textarea id="monthNotes" rows="2" placeholder="本月健身心得/变化...">${currentMonthData.notes || ''}</textarea>
            <button class="btn" id="saveMonthlyRecordBtn">💾 保存本月记录</button>
        </div>
    `;
    
    // 每月变化表格 - 显示12个月数据
    let monthlyTableHtml = `<div class="card"><h3>📊 每月身体变化总结</h3>`;
    monthlyTableHtml += `<div style="overflow-x: auto;">
        <table style="width:100%; border-collapse: collapse;">
            <thead>
                <tr><th style="padding: 10px; background: #00D4FF20; text-align: left;">月份</th>
                    <th style="padding: 10px; background: #00D4FF20; text-align: left;">体重(kg)</th>
                    <th style="padding: 10px; background: #00D4FF20; text-align: left;">体脂率(%)</th>
                    <th style="padding: 10px; background: #00D4FF20; text-align: left;">腰围(cm)</th>
                    <th style="padding: 10px; background: #00D4FF20; text-align: left;">肌肉量(kg)</th>
                    <th style="padding: 10px; background: #00D4FF20; text-align: left;">变化</th>
                    <th style="padding: 10px; background: #00D4FF20; text-align: left;">操作</th>
                </tr>
            </thead>
            <tbody>`;
    
    // 按月份排序，最近的在前面
    let sortedMonths = [...monthlyData].sort((a, b) => b.month.localeCompare(a.month));
    for (let m of sortedMonths) {
        let monthDisplay = m.month;
        let weightChangeText = "";
        let prevMonth = monthlyData.find(p => p.month === getPreviousMonth(m.month));
        if (prevMonth && prevMonth.weight && m.weight) {
            let diff = (m.weight - prevMonth.weight).toFixed(1);
            weightChangeText = diff > 0 ? `📈 +${diff}` : (diff < 0 ? `📉 ${diff}` : `➖`);
        }
        
        monthlyTableHtml += `
            <tr style="border-bottom: 1px solid #2A3655;">
                <td style="padding: 10px; color: #00D4FF;">${monthDisplay}</td>
                <td style="padding: 10px;">${m.weight || '-'}</td>
                <td style="padding: 10px;">${m.bodyFat || '-'}</td>
                <td style="padding: 10px;">${m.waist || '-'}</td>
                <td style="padding: 10px;">${m.muscle || '-'}</td>
                <td style="padding: 10px; color: ${weightChangeText.includes('+') ? '#FF8888' : (weightChangeText.includes('-') ? '#00E5B2' : '#aaa')}">${weightChangeText}</td>
                <td style="padding: 10px;">
                    <button class="btn-small btn-danger" onclick="window.deleteMonthlyRecord('${m.month}')" style="padding: 4px 8px;">删除</button>
                </td>
            </tr>
        `;
    }
    
    if (sortedMonths.length === 0) {
        monthlyTableHtml += `<tr><td colspan="7" style="padding: 20px; text-align: center; color: #aaa;">暂无记录，开始添加你的每月数据吧！</td></tr>`;
    }
    
    monthlyTableHtml += `</tbody> </table></div></div>`;
    
    // 体脂率计算器
    let bodyFatCalculatorHtml = `
        <div class="card">
            <h3>📏 体脂率计算器</h3>
            <p style="color:#aaa; font-size:0.8rem;">📌 使用美国海军方法估算，腰围测量肚脐位置</p>
            <div class="form-row">
                <input type="number" id="bfWeight" placeholder="体重 (kg)" step="0.1">
                <input type="number" id="bfWaist" placeholder="腰围 (cm)" step="0.1">
                <input type="number" id="bfNeck" placeholder="颈围 (cm)" step="0.1">
                <input type="number" id="bfHeight" placeholder="身高 (cm)" step="1">
            </div>
            <select id="bfGender">
                <option value="male">男性</option>
                <option value="female">女性</option>
            </select>
            <button class="btn" id="calcBodyFatBtn">📊 计算体脂率</button>
            <div id="bodyFatResult"></div>
        </div>
    `;
    
    // 每月总结12个月 - 健身人每月在意的内容
    let monthsHtml = `<div class="card"><h3>📅 每月健身指南</h3><div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem;">`;
    for (let i = 1; i <= 12; i++) {
        let tip = getMonthlyTip(i);
        let isCurrent = i === currentMonth;
        monthsHtml += `
            <div style="background: ${isCurrent ? '#00D4FF20' : '#1A2235'}; border-radius: 16px; padding: 1rem; border-left: 3px solid ${isCurrent ? '#00D4FF' : '#2A3655'};">
                <h4 style="color: #00D4FF; margin-bottom: 0.5rem;">${tip.title}</h4>
                <div style="font-size: 0.85rem; white-space: pre-line; color: #ccc;">${tip.content}</div>
                ${isCurrent ? '<p style="color: #00D4FF; margin-top: 0.5rem; font-size: 0.7rem;">⭐ 本月进行中</p>' : ''}
            </div>
        `;
    }
    monthsHtml += `</div></div>`;
    
    return `
        <div class="page-title">
            年度总结
            <small>回顾一年的蜕变 📅</small>
        </div>
        <div class="container">
            <h2>📅 年度健身总结</h2>
            
            <div class="card">
                <h3>⚖️ 年度体重变化</h3>
                <div class="form-row">
                    <input type="number" id="startWeight" placeholder="年初体重 (kg)" value="${summary.startWeight || ''}" step="0.1">
                    <input type="number" id="currentWeight" placeholder="当前体重 (kg)" value="${summary.currentWeight || ''}" step="0.1">
                </div>
                ${weightChange !== null ? `<p style="margin-top:0.5rem;">📉 体重变化: ${weightChange > 0 ? '📈 增重' : '📉 减重'} ${Math.abs(weightChange)} 公斤</p>` : ''}
                <button class="btn" id="saveWeightYearBtn">💾 保存体重数据</button>
            </div>
            
            <div class="card">
                <h3>💪 年度体脂率变化</h3>
                <div class="form-row">
                    <input type="number" id="startBodyFat" placeholder="年初体脂率 (%)" value="${summary.startBodyFat || ''}" step="0.1">
                    <input type="number" id="currentBodyFat" placeholder="当前体脂率 (%)" value="${summary.currentBodyFat || ''}" step="0.1">
                </div>
                <select id="bodyFatGenderSelect">
                    <option value="male">男性</option>
                    <option value="female">女性</option>
                </select>
                ${bodyFatChange !== null ? `<p style="margin-top:0.5rem;">📊 体脂率变化: ${bodyFatChange > 0 ? '📈 上升' : '📉 下降'} ${Math.abs(bodyFatChange)}%</p>` : ''}
                <button class="btn" id="saveBodyFatYearBtn">💾 保存体脂数据</button>
                <div id="bodyFatEvaluation"></div>
            </div>
            
            ${bodyFatCalculatorHtml}
            ${monthlyFormHtml}
            ${monthlyTableHtml}
            
            <div class="card">
                <h3>📸 健身成果照片 (仅自己可见)</h3>
                <input type="file" id="photoUpload" accept="image/*">
                <button class="btn" id="uploadPhotoBtn">📷 上传照片</button>
                <div id="photosGallery" style="margin-top: 1rem;">
                    ${photosHtml || '<p>暂无照片，上传你的健身成果吧！</p>'}
                </div>
            </div>
            
            ${monthsHtml}
            
            <div class="card">
                <h3>📝 年度笔记</h3>
                <textarea id="yearNotes" rows="4" placeholder="写下你这一年的健身心得...">${summary.notes || ''}</textarea>
                <button class="btn" id="saveYearNotesBtn">💾 保存笔记</button>
            </div>
        </div>
    `;
}

function renderContactPage() {
    const comments = getComments();
    
    return `
        <div class="page-title">
            联系我们
            <small>有任何问题？欢迎留言 💬</small>
        </div>
        <div class="container">
            <div class="card" style="text-align: center;">
                <h2>📧 联系我们</h2>
                <p style="font-size: 1.2rem; margin: 1rem 0;">
                    📩 <a href="mailto:zayya58800@gmail.com" style="color: #00D4FF;">zayya58800@gmail.com</a>
                </p>
                <p>有任何问题或建议，欢迎给我们发邮件！</p>
            </div>
            
            <div class="card">
                <h3>💬 留言评论</h3>
                <div id="commentsList" style="max-height: 300px; overflow-y: auto; margin-bottom: 1rem;">
                    ${comments.slice().reverse().map(c => `
                        <div class="comment-item">
                            <span class="comment-name">${escapeHtml(c.name)}</span>
                            <span class="comment-time">${c.time}</span>
                            <p style="margin-top: 0.5rem;">${escapeHtml(c.comment)}</p>
                        </div>
                    `).join('') || '<p style="color:#aaa">暂无评论，快来第一条吧！</p>'}
                </div>
                <input type="text" id="commentName" placeholder="你的名字 (可选)" style="margin-bottom: 0.5rem;">
                <textarea id="commentContent" rows="3" placeholder="写下你的评论..."></textarea>
                <button class="btn" id="submitCommentBtn">📝 提交评论</button>
            </div>
        </div>
    `;
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function updateDailyIntakeDisplay() {
    let todayIntake = getTodayIntake();
    let listContainer = document.getElementById('dailyIntakeList');
    let totalContainer = document.getElementById('dailyTotal');
    
    if (listContainer) {
        listContainer.innerHTML = todayIntake.items.map((item, idx) => `
            <div class="intake-item">
                <span>🍽️ ${item.name} · ${item.quantity}${item.unit} · ${item.calories}大卡 · ${item.protein}g蛋白</span>
                <button class="delete-intake" data-idx="${idx}">删除</button>
            </div>
        `).join('');
        
        if (todayIntake.items.length === 0) listContainer.innerHTML = '<p style="color:#aaa">今日还没有记录食物</p>';
        
        document.querySelectorAll('.delete-intake').forEach(btn => {
            btn.addEventListener('click', (e) => {
                let idx = parseInt(btn.dataset.idx);
                deleteFoodIntake(idx);
                updateDailyIntakeDisplay();
            });
        });
    }
    
    if (totalContainer) {
        totalContainer.innerHTML = `📊 今日总计: ${todayIntake.calories} 大卡 · ${todayIntake.protein} 克蛋白质`;
    }
}

function searchFoods() {
    let keyword = document.getElementById('foodSearchInput')?.value || '';
    let filtered = searchFood(keyword);
    let container = document.getElementById('foodResults');
    if (container) {
        container.innerHTML = filtered.map(food => `
            <div class="food-item">
                <input type="checkbox" class="food-checkbox" data-name="${food.name}" data-base="${food.baseAmount}" data-unit="${food.unit}" data-cal="${food.caloriesPerUnit}" data-protein="${food.proteinPerUnit}" data-type="${food.type}">
                <span class="food-name">${food.name}</span>
                <input type="number" class="quantity-input" placeholder="数量 (${food.unit})" value="1" min="0.1" step="0.1">
                <span class="food-calories">🔥 ${food.caloriesPerUnit}大卡/${food.baseAmount}${food.unit} · 💪 ${food.proteinPerUnit}g蛋白</span>
            </div>
        `).join('');
    }
}

// ==================== 事件绑定 ====================
let currentPage = "home";

function navigate(page) {
    currentPage = page;
    const main = document.getElementById('app');
    if (page === 'home') {
        main.innerHTML = renderHome();
        attachHomeEvents();
    } else if (page === 'train') {
        main.innerHTML = renderTrainPage();
        attachTrainEvents();
    } else if (page === 'cardio') {
        main.innerHTML = renderCardioPage();
        attachCardioEvents();
    } else if (page === 'nutrition') {
        main.innerHTML = renderNutritionPage();
        attachNutritionEvents();
    } else if (page === 'library') {
        main.innerHTML = renderLibrary();
        attachLibraryEvents();
    } else if (page === 'progress') {
        main.innerHTML = renderProgress();
        attachProgressEvents();
    } else if (page === 'yearSummary') {
        main.innerHTML = renderYearSummaryPage();
        attachYearSummaryEvents();
    } else if (page === 'contact') {
        main.innerHTML = renderContactPage();
        attachContactEvents();
    }
    
    updateBottomNav(page);
}

function attachHomeEvents() {
    document.getElementById('calcBmiBtn')?.addEventListener('click', () => {
        let h = parseFloat(document.getElementById('bmiHeight').value);
        let w = parseFloat(document.getElementById('bmiWeight').value);
        if (h && w) {
            let result = calculateBMI(w, h);
            document.getElementById('bmiResult').innerHTML = `<div class="result-box">你的BMI: ${result.bmi} · ${result.status}</div>`;
        } else {
            alert('请输入身高和体重');
        }
    });
    
    document.getElementById('calcHomeBodyFatBtn')?.addEventListener('click', () => {
        let weight = parseFloat(document.getElementById('bfHomeWeight').value);
        let waist = parseFloat(document.getElementById('bfHomeWaist').value);
        let neck = parseFloat(document.getElementById('bfHomeNeck').value);
        let height = parseFloat(document.getElementById('bfHomeHeight').value);
        let gender = document.getElementById('bfHomeGender').value;
        
        if (!weight || !waist || !neck || !height) {
            alert("请填写完整信息：体重、腰围、颈围、身高");
            return;
        }
        
        let bodyFat = calculateBodyFat(weight, waist, neck, height, gender);
        let status = getBodyFatStatus(bodyFat, gender);
        
        document.getElementById('homeBodyFatResult').innerHTML = `
            <div class="result-box">
                <p><strong>📊 估算体脂率:</strong> <span style="color:${status.color}; font-size:1.2rem;">${bodyFat}%</span></p>
                <p><strong>💡 评估:</strong> <span style="color:${status.color};">${status.text}</span></p>
                <p><strong>📝 建议:</strong> ${status.suggestion}</p>
                <hr style="margin: 0.5rem 0; border-color:#2A3655;">
                <p style="font-size:0.8rem; color:#aaa;">📌 男性标准体脂: 10-20% | 女性标准体脂: 18-28%</p>
                <p style="font-size:0.8rem; color:#aaa;">📌 体脂率越低肌肉线条越清晰</p>
            </div>
        `;
    });
    
    document.getElementById('startTrainBtn')?.addEventListener('click', () => navigate('train'));
    document.getElementById('goCardioBtn')?.addEventListener('click', () => navigate('cardio'));
    
    document.querySelectorAll('#muscleGridHome .muscle-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            const muscle = chip.dataset.muscle;
            navigate('train');
            setTimeout(() => {
                const selector = document.querySelectorAll('#trainMuscleSelector .muscle-chip');
                selector.forEach(c => { if (c.dataset.muscle === muscle) c.classList.add('selected'); });
                const selected = Array.from(document.querySelectorAll('#trainMuscleSelector .muscle-chip.selected')).map(c => c.dataset.muscle);
                updatePlanUI(selected);
            }, 100);
        });
    });
}

function attachTrainEvents() {
    const container = document.getElementById('trainMuscleSelector');
    if (container) {
        container.querySelectorAll('.muscle-chip').forEach(chip => {
            chip.addEventListener('click', () => chip.classList.toggle('selected'));
        });
    }
    document.getElementById('generatePlanBtn')?.addEventListener('click', () => {
        const selected = Array.from(document.querySelectorAll('#trainMuscleSelector .muscle-chip.selected')).map(c => c.dataset.muscle);
        if (selected.length === 0) { alert("请至少选一个部位"); return; }
        updatePlanUI(selected);
    });
    document.getElementById('completeWorkoutBtn')?.addEventListener('click', completeWorkout);
    const defaultRec = getDailyRecommendation();
    updatePlanUI(defaultRec);
}

function attachCardioEvents() {
    const weightLogs = getWeightLogs();
    const currentWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : 70;
    
    document.getElementById('runKm')?.addEventListener('input', (e) => {
        let km = parseFloat(e.target.value);
        if (km && currentWeight) {
            let cal = calculateRunningCalories(km, currentWeight);
            document.getElementById('runCaloriesPreview').innerHTML = `预计消耗: ${cal} 大卡 (基于体重 ${currentWeight}kg)`;
        }
    });
    
    document.getElementById('saveRunBtn')?.addEventListener('click', () => {
        let km = parseFloat(document.getElementById('runKm').value);
        if (!km || km <= 0) { alert("请输入有效的跑步距离"); return; }
        let cal = calculateRunningCalories(km, currentWeight);
        saveRun(getTodayStr(), km, cal);
        alert(`✅ 今日跑步 ${km} 公里，消耗 ${cal} 大卡！`);
        navigate('cardio');
    });
    
    let startBtn = document.getElementById('startLocationBtn');
    let endBtn = document.getElementById('endLocationBtn');
    let statusDiv = document.getElementById('gpsStatus');
    
    startBtn?.addEventListener('click', async () => {
        statusDiv.innerHTML = "📍 正在获取位置...";
        let result = await startRunTracking();
        if (result.success) {
            isTracking = true;
            statusDiv.innerHTML = "✅ " + result.message + " 开始跑步，结束时点击结束按钮";
            startBtn.style.display = "none";
            endBtn.style.display = "block";
        } else {
            statusDiv.innerHTML = "❌ " + result.message;
        }
    });
    
    endBtn?.addEventListener('click', async () => {
        if (!isTracking) return;
        statusDiv.innerHTML = "📍 正在计算距离...";
        let result = await endRunTracking();
        if (result.success && result.km > 0) {
            let km = result.km;
            let cal = calculateRunningCalories(km, currentWeight);
            statusDiv.innerHTML = `✅ ${result.message}，消耗约 ${cal} 大卡`;
            document.getElementById('runKm').value = km.toFixed(2);
            document.getElementById('runCaloriesPreview').innerHTML = `预计消耗: ${cal} 大卡`;
            startBtn.style.display = "block";
            endBtn.style.display = "none";
            isTracking = false;
        } else {
            statusDiv.innerHTML = "❌ " + (result.message || "距离太短或定位失败");
            startBtn.style.display = "block";
            endBtn.style.display = "none";
            isTracking = false;
        }
    });
    
    // 编辑和删除跑步记录
    document.querySelectorAll('.edit-run').forEach(btn => {
        btn.addEventListener('click', (e) => {
            let date = btn.dataset.date;
            let oldKm = parseFloat(btn.dataset.km);
            let newKm = prompt("修改跑步距离 (公里):", oldKm);
            if (newKm && !isNaN(parseFloat(newKm))) {
                let newCal = calculateRunningCalories(parseFloat(newKm), currentWeight);
                updateRun(date, parseFloat(newKm), newCal);
                navigate('cardio');
            }
        });
    });
    
    document.querySelectorAll('.delete-run').forEach(btn => {
        btn.addEventListener('click', (e) => {
            let date = btn.dataset.date;
            if (confirm(`确定删除 ${date} 的跑步记录吗？`)) {
                deleteRun(date);
                navigate('cardio');
            }
        });
    });
}

function attachNutritionEvents() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentNutritionTab = btn.dataset.tab;
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    document.getElementById('calculateNutritionBtn')?.addEventListener('click', () => {
        let weight = parseFloat(document.getElementById('nutriWeight').value);
        let height = parseFloat(document.getElementById('nutriHeight').value);
        let age = parseFloat(document.getElementById('nutriAge').value);
        let gender = document.getElementById('nutriGender').value;
        let activity = document.getElementById('nutriActivity').value;
        
        if (!weight || !height || !age) { alert("请填写完整信息"); return; }
        
        let bmr = calculateBMR(weight, height, age, gender);
        let tdee = calculateTDEE(bmr, activity);
        let goal = currentNutritionTab === 'weightLoss' ? 'cut' : (currentNutritionTab === 'muscleGain' ? 'bulk' : 'maintain');
        
        let targetCalories, protein;
        if (goal === 'cut') {
            targetCalories = getCutCalories(tdee);
            protein = getProteinRecommendation(weight, 'cut');
        } else if (goal === 'bulk') {
            targetCalories = getBulkCalories(tdee);
            protein = getProteinRecommendation(weight, 'bulk');
        } else {
            targetCalories = tdee;
            protein = getProteinRecommendation(weight, 'maintain');
        }
        
        let fat = Math.round(targetCalories * 0.25 / 9);
        let carbs = Math.round((targetCalories - (protein * 4) - (fat * 9)) / 4);
        
        document.getElementById('nutritionResult').innerHTML = `
            <div class="result-box">
                <p><strong>📊 基础代谢率 (BMR):</strong> ${Math.round(bmr)} 大卡/天</p>
                <p><strong>🏃 每日总消耗 (TDEE):</strong> ${Math.round(tdee)} 大卡/天</p>
                <p><strong>🎯 推荐每日摄入:</strong> ${Math.round(targetCalories)} 大卡</p>
                <p><strong>💪 每日蛋白质:</strong> ${Math.round(protein)} 克 (约 ${Math.round(protein*4)} 大卡)</p>
                <p><strong>🥑 每日脂肪:</strong> ${fat} 克 (约 ${Math.round(fat*9)} 大卡)</p>
                <p><strong>🍚 每日碳水:</strong> ${carbs} 克 (约 ${Math.round(carbs*4)} 大卡)</p>
            </div>
        `;
    });
    
    document.getElementById('addSelectedFoodsBtn')?.addEventListener('click', () => {
        let selectedFoods = [];
        document.querySelectorAll('.food-checkbox:checked').forEach(cb => {
            let itemDiv = cb.closest('.food-item');
            let quantityInput = itemDiv.querySelector('.quantity-input');
            let quantity = parseFloat(quantityInput.value) || 1;
            let name = cb.dataset.name;
            let baseAmount = parseFloat(cb.dataset.base);
            let unit = cb.dataset.unit;
            let calPerUnit = parseFloat(cb.dataset.cal);
            let proteinPerUnit = parseFloat(cb.dataset.protein);
            
            let multiplier = quantity / baseAmount;
            let calories = Math.round(calPerUnit * multiplier);
            let protein = Math.round(proteinPerUnit * multiplier * 10) / 10;
            
            selectedFoods.push({ name, quantity, unit, calories, protein });
            cb.checked = false;
            quantityInput.value = 1;
        });
        
        if (selectedFoods.length === 0) {
            alert("请先选择食物并填写数量");
            return;
        }
        
        addFoodIntake(selectedFoods);
        updateDailyIntakeDisplay();
    });
    
    document.getElementById('clearTodayIntakeBtn')?.addEventListener('click', () => {
        if (confirm("确定清空今日所有食物记录吗？")) {
            clearTodayIntake();
            updateDailyIntakeDisplay();
        }
    });
    
    updateDailyIntakeDisplay();
}

function attachLibraryEvents() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        });
    });
}

function attachProgressEvents() {
    document.getElementById('saveWeightBtn')?.addEventListener('click', () => {
        const weight = parseFloat(document.getElementById('weightInput').value);
        if (isNaN(weight)) { alert("请输入有效的体重数字"); return; }
        saveWeight(weight, getTodayStr());
        navigate('progress');
    });
}

function attachYearSummaryEvents() {
    // 保存体重年度数据
    document.getElementById('saveWeightYearBtn')?.addEventListener('click', () => {
        let summary = getYearSummary();
        summary.startWeight = parseFloat(document.getElementById('startWeight').value) || null;
        summary.currentWeight = parseFloat(document.getElementById('currentWeight').value) || null;
        saveYearSummary(summary);
        alert("体重数据已保存！");
        navigate('yearSummary');
    });
    
    // 保存体脂年度数据
    document.getElementById('saveBodyFatYearBtn')?.addEventListener('click', () => {
        let summary = getYearSummary();
        summary.startBodyFat = parseFloat(document.getElementById('startBodyFat').value) || null;
        summary.currentBodyFat = parseFloat(document.getElementById('currentBodyFat').value) || null;
        saveYearSummary(summary);
        alert("体脂数据已保存！");
        navigate('yearSummary');
    });
    
    // 保存笔记
    document.getElementById('saveYearNotesBtn')?.addEventListener('click', () => {
        let summary = getYearSummary();
        summary.notes = document.getElementById('yearNotes').value;
        saveYearSummary(summary);
        alert("笔记已保存！");
    });
    
    // 上传照片
    document.getElementById('uploadPhotoBtn')?.addEventListener('click', () => {
        let fileInput = document.getElementById('photoUpload');
        let file = fileInput.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = function(e) {
                addProgressPhoto(e.target.result);
                navigate('yearSummary');
            };
            reader.readAsDataURL(file);
        } else {
            alert("请先选择照片");
        }
    });
    
    // 肌肉量估算器
    document.getElementById('estimateMuscleBtn')?.addEventListener('click', () => {
        let weight = parseFloat(document.getElementById('monthWeight').value);
        let bodyFat = parseFloat(document.getElementById('monthBodyFat').value);
        let gender = document.getElementById('bodyFatGenderSelect')?.value || 'male';
        let fitnessLevel = document.getElementById('fitnessLevelSelect').value;
        
        if (!weight || !bodyFat) {
            alert("请先填写体重和体脂率");
            return;
        }
        
        if (weight <= 0 || bodyFat <= 0 || bodyFat >= 60) {
            alert("请输入有效的体重(kg)和体脂率(%)");
            return;
        }
        
        let estimatedMuscle = estimateMuscleMass(weight, bodyFat, gender, fitnessLevel);
        let evaluation = evaluateMuscleMass(estimatedMuscle, weight, gender);
        
        document.getElementById('muscleEstimateResult').innerHTML = `
            <span style="color: ${evaluation.color}">📊 估算肌肉量: ${estimatedMuscle} kg (占体重 ${(estimatedMuscle/weight*100).toFixed(1)}%)</span>
            <br>💡 ${evaluation.text} · ${evaluation.suggestion}
            <button class="btn-small" id="applyMuscleToRecord" style="margin-top: 5px; padding: 2px 8px;">📝 应用到本月记录</button>
        `;
        
        document.getElementById('applyMuscleToRecord')?.addEventListener('click', () => {
            document.getElementById('monthMuscle').value = estimatedMuscle;
            alert(`✅ 肌肉量 ${estimatedMuscle} kg 已填入上方表格`);
        });
    });
    
    // 保存每月身体变化记录
    document.getElementById('saveMonthlyRecordBtn')?.addEventListener('click', () => {
        let month = document.getElementById('recordMonth').value;
        let weight = parseFloat(document.getElementById('monthWeight').value) || null;
        let bodyFat = parseFloat(document.getElementById('monthBodyFat').value) || null;
        let waist = parseFloat(document.getElementById('monthWaist').value) || null;
        let muscle = parseFloat(document.getElementById('monthMuscle').value) || null;
        let notes = document.getElementById('monthNotes').value;
        
        if (!month) {
            alert("请选择月份");
            return;
        }
        
        saveMonthlyRecord(month, weight, bodyFat, waist, muscle, notes);
        alert(`✅ ${month} 的身体数据已保存！`);
        navigate('yearSummary');
    });
    
        // 全局删除每月记录函数
    window.deleteMonthlyRecord = function(month) {
        if (confirm(`确定删除 ${month} 的记录吗？`)) {
            var records = getMonthlyBodyChanges();
            records = records.filter(function(r) { return r.month !== month; });
            localStorage.setItem("fitness_monthly_changes", JSON.stringify(records));
            navigate('yearSummary');
        }
    };
    
    // 体脂率计算器
    document.getElementById('calcBodyFatBtn')?.addEventListener('click', () => {
        let weight = parseFloat(document.getElementById('bfWeight').value);
        let waist = parseFloat(document.getElementById('bfWaist').value);
        let neck = parseFloat(document.getElementById('bfNeck').value);
        let height = parseFloat(document.getElementById('bfHeight').value);
        let gender = document.getElementById('bfGender').value;
        
        if (!weight || !waist || !neck || !height) {
            alert("请填写完整信息：体重、腰围、颈围、身高");
            return;
        }
        
        let bodyFat = calculateBodyFat(weight, waist, neck, height, gender);
        let status = getBodyFatStatus(bodyFat, gender);
        
        document.getElementById('bodyFatResult').innerHTML = `
            <div class="result-box">
                <p><strong>📊 估算体脂率:</strong> <span style="color:${status.color}; font-size:1.2rem;">${bodyFat}%</span></p>
                <p><strong>💡 评估:</strong> <span style="color:${status.color};">${status.text}</span></p>
                <p><strong>📝 建议:</strong> ${status.suggestion}</p>
                <hr style="margin: 0.5rem 0; border-color:#2A3655;">
                <p style="font-size:0.8rem; color:#aaa;">📌 男性标准体脂: 10-20% | 女性标准体脂: 18-28%</p>
                <p style="font-size:0.8rem; color:#aaa;">📌 体脂率越低肌肉线条越清晰</p>
            </div>
        `;
    });
    
    // 体脂率评估显示
    let gender = document.getElementById('bodyFatGenderSelect')?.value || 'male';
    let summary = getYearSummary();
    if (summary.currentBodyFat) {
        let evaluation = evaluateBodyFat(summary.currentBodyFat, gender);
        document.getElementById('bodyFatEvaluation').innerHTML = `<p class="result-box">💡 当前体脂率评估: ${evaluation}</p>`;
    }
}

function attachContactEvents() {
    document.getElementById('submitCommentBtn')?.addEventListener('click', () => {
        let name = document.getElementById('commentName').value;
        let comment = document.getElementById('commentContent').value;
        if (!comment) { alert("请输入评论内容"); return; }
        saveComment(name || "匿名用户", comment);
        navigate('contact');
    });
}

// 全局删除照片函数
window.deleteProgressPhoto = function(photoId) {
    if (confirm("确定删除这张照片吗？")) {
        deleteProgressPhoto(photoId);
        navigate('yearSummary');
    }
};

// ==================== 底部导航更新 ====================
function updateBottomNav(page) {
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        if (item.dataset.page === page) item.classList.add('active');
        else item.classList.remove('active');
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
        if (a.dataset.page === page) a.classList.add('active');
        else a.classList.remove('active');
    });
}

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    navigate('home');
    
    // 顶部桌面导航（仅桌面可见）
    const burger = document.getElementById('burgerBtn');
    const navLinksDiv = document.getElementById('navLinks');
    burger.addEventListener('click', () => navLinksDiv.classList.toggle('show'));
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigate(link.dataset.page);
            if (window.innerWidth <= 768) navLinksDiv.classList.remove('show');
        });
    });
    
    // 底部移动端导航
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.addEventListener('click', () => {
            navigate(item.dataset.page);
        });
    });
    
    window.searchFoods = searchFoods;
});
