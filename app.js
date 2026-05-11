
// ==================== 全局变量 ====================
let currentExercises = [];
let currentSelectedMuscles = [];
let currentNutritionTab = "weightLoss";
let isTracking = false;
const WEEK_DAYS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

// ==================== 动图查看功能 ====================
function showGifModal(gifSearchKeyword) {
    if (!gifSearchKeyword) return;
    window.open(
        'https://giphy.com/search/' + encodeURIComponent(gifSearchKeyword + ' exercise'),
        'gif_' + Date.now(),
        'width=800,height=600,scrollbars=yes'
    );
}

function getGifButtonHtml(searchKeyword) {
    if (!searchKeyword) return '';
    var escaped = searchKeyword.replace(/'/g, "\\'");
    return '<button class="btn-small gif-btn" onclick="showGifModal(\'' + escaped + '\')" style="background:#FF69B4; color:#fff; padding:2px 8px; font-size:0.7rem; margin-left:4px;">🎬 动图</button>';
}

// ==================== 页面渲染函数 ====================
function renderHome() {
    const recMuscles = getDailyRecommendation();
    const logs = getWeightLogs();
    const todayIntake = getTodayIntake();
    const todayExpenditure = getTodayExpenditure();
    const netCalories = todayIntake.calories - todayExpenditure.total;
    const weightHtml = logs.slice(-3).map(function(l) { return '<div>' + l.date + ': ' + l.weight + ' kg</div>'; }).join('') || t('homeNoRecord');
    const todayRun = getRunByDate(getTodayStr());
    
    let netClass = "", netText = "";
    if (netCalories < -300) {
        netClass = "summary-deficit";
        netText = t('homeNetDeficit') + ' ' + (-netCalories) + ' ' + t('homeDeficitSuffix');
    } else if (netCalories < 0) {
        netClass = "summary-deficit";
        netText = t('homeNetDeficit') + ' ' + (-netCalories) + ' ' + t('kcalUnit');
    } else if (netCalories > 300) {
        netClass = "summary-surplus";
        netText = t('homeNetSurplus') + ' ' + netCalories + ' ' + t('kcalUnit') + ' (' + t('homeExcess') + ')';
    } else if (netCalories > 0) {
        netClass = "summary-surplus";
        netText = t('homeNetSurplus') + ' ' + netCalories + ' ' + t('kcalUnit');
    } else {
        netClass = "summary-balanced";
        netText = t('homeNetBalance');
    }
    
    const myPlan = getMyPlan();
    let myPlanHtml = '';
    if (myPlan && myPlan.exercises && myPlan.exercises.length > 0) {
        const planDate = myPlan.date || t('commonYesterday');
        myPlanHtml = '' +
            '<div class="card">' +
            '<h2>📋 ' + t('homeMyPlan') + '</h2>' +
            '<p style="color:#aaa; font-size:0.85rem;">' + t('homeFromDate') + ' ' + planDate + '</p>' +
            '<div style="margin: 8px 0;">' +
            myPlan.exercises.map(function(ex, i) {
                return '<div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid #1A2235; font-size:0.9rem;">' +
                    '<span>' + (i+1) + '. 🏋️ ' + t(ex.name) + '</span>' +
                    '<span style="color:#aaa;">' + (ex.weight||'') + (ex.weight ? t('kgUnit') + ' × ' : '') + ex.sets + t('setsUnit') + '×' + repsDisplay(ex.reps) + '</span></div>';
            }).join('') +
            '</div>' +
            '<button class="btn btn-small" id="loadMyPlanBtn" style="width:100%;">' + t('homeLoadPlan') + '</button>' +
            '<button class="btn-small btn-danger" id="clearMyPlanBtn" style="margin-top:6px; width:100%;">' + t('homeClearPlan') + '</button>' +
            '</div>';
    }
    
    const weekPlan = getWeekPlan();
    let hasWeekPlan = false;
    for (const day of WEEK_DAYS) {
        if (weekPlan[day] && weekPlan[day].length > 0) { hasWeekPlan = true; break; }
    }
    let weekPlanHtml = '';
    if (hasWeekPlan) {
        weekPlanHtml = '' +
            '<div class="card">' +
            '<h2>📅 ' + t('homeWeekPlanTitle') + '</h2>' +
            '<div style="display:flex; flex-wrap:wrap; gap:6px; margin:10px 0;">' +
            WEEK_DAYS.map(function(d) {
                var count = (weekPlan[d]||[]).length;
                return '<div style="background:' + (count>0?'#00D4FF':'#1A2235') + '; color:' + (count>0?'#000':'#666') + '; padding:6px 12px; border-radius:8px; font-size:0.8rem; font-weight:bold;">' + d + (count>0?' · ' + count + '个':'') + '</div>';
            }).join('') +
            '</div>' +
            '<button class="btn btn-small" id="goWeekPlanBtn" style="width:100%;">' + t('homeViewEditWeek') + '</button>' +
            '</div>';
    } else {
        weekPlanHtml = '' +
            '<div class="card">' +
            '<h2>📅 ' + t('homeWeekPlanTitle') + '</h2>' +
            '<p style="color:#aaa; font-size:0.85rem;">' + t('homeNoWeekPlan') + '</p>' +
            '<button class="btn btn-small" id="goWeekPlanBtn" style="width:100%;">' + t('homeCreateWeekPlan') + '</button>' +
            '</div>';
    }
    
    return '' +
        '<div class="page-title">' +
        t('homeToday') +
        '<small>' + new Date().toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' }) + '</small></div>' +
        '<div class="container">' +
        '<div class="summary-card">' +
        '<h3>📊 ' + t('homeCalSummary') + '</h3>' +
        '<p>' + t('homeIntake') + ': ' + todayIntake.calories + ' ' + t('kcalUnit') + '</p>' +
        '<p>' + t('homeExpenditure') + ': ' + todayExpenditure.total + ' ' + t('kcalUnit') + '</p>' +
        '<p class="' + netClass + '">' + netText + '</p></div>' +
        
        '<div class="card">' +
        '<h2>🔥 ' + t('homeBmrTdee') + '</h2>' +
        '<p style="color:#aaa; font-size:0.8rem;">' + t('homeFillStats') + '</p>' +
        '<div class="form-row">' +
        '<input type="number" id="bmrHeight" placeholder="' + t('homeHeightCm') + '" step="1">' +
        '<input type="number" id="bmrWeight" placeholder="' + t('homeWeightKg') + '" step="0.1">' +
        '<input type="number" id="bmrAge" placeholder="' + t('homeAge') + '" step="1" min="10" max="100"></div>' +
        '<div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px;">' +
        '<select id="bmrGender" style="flex:1; min-width:80px;">' +
        '<option value="male">' + t('homeMale') + '</option>' +
        '<option value="female">' + t('homeFemale') + '</option></select>' +
        '<select id="bmrActivity" style="flex:2; min-width:140px;">' +
        '<option value="sedentary">' + t('homeSedentary') + '</option>' +
        '<option value="light">' + t('homeLight') + '</option>' +
        '<option value="moderate" selected>' + t('homeModerate') + '</option>' +
        '<option value="active">' + t('homeActive') + '</option>' +
        '<option value="veryActive">' + t('homeVeryActive') + '</option></select></div>' +
        '<button class="btn" id="calcBmrBtn">' + t('homeCalcBmr') + '</button>' +
        '<div id="bmrResult" style="margin-top:10px;"></div></div>' +
        
        '<div class="card">' +
        '<h2>📊 ' + t('homeBmiCalc') + '</h2>' +
        '<div class="form-row">' +
        '<input type="number" id="bmiHeight" placeholder="' + t('homeHeightCm') + '" step="1">' +
        '<input type="number" id="bmiWeight" placeholder="' + t('homeWeightKg') + '" step="0.1">' +
        '<button class="btn btn-small" id="calcBmiBtn">' + t('homeCalcBmi') + '</button></div>' +
        '<div id="bmiResult"></div></div>' +
        
        '<div class="card">' +
        '<h2>💪 ' + t('homeTrainToday') + '</h2>' +
        '<p style="color: #00D4FF; font-size: 1.2rem;">' + t('homeRecTrain') + ': ' + recMuscles.join(' · ') + '</p>' +
        '<button class="btn" id="startTrainBtn">' + t('homeStartTrain') + '</button></div>' +
        
        '<div class="card">' +
        '<h2>🏃 ' + t('homeTodayRun') + '</h2>' +
        (todayRun ? '<p style="color:#00E5B2">✅ ' + t('homeTodayRunDone', {km: todayRun.km, cal: todayRun.calories}) + '</p>' : '<p style="color:#aaa">' + t('homeNoRun') + '</p>') +
        '<button class="btn btn-outline" id="goCardioBtn">' + t('homeGoRun') + '</button></div>' +
        
        '<h3>🎯 ' + t('homeSelectMuscle') + '</h3>' +
        '<div class="muscle-grid" id="muscleGridHome">' +
        MUSCLES_SIMPLE.map(function(m) {
            var muscleKey = '';
            if (m === '胸部') muscleKey = 'muscleChest';
            else if (m === '背部') muscleKey = 'muscleBack';
            else if (m === '肩膀') muscleKey = 'muscleShoulder';
            else if (m === '手臂(二头)') muscleKey = 'muscleBicep';
            else if (m === '手臂(三头)') muscleKey = 'muscleTricep';
            else if (m === '腹部') muscleKey = 'muscleAbs';
            else if (m === '大腿前侧') muscleKey = 'muscleQuad';
            else if (m === '大腿后侧') muscleKey = 'muscleHamstring';
            else if (m === '臀部') muscleKey = 'muscleGlute';
            else if (m === '小腿') muscleKey = 'muscleCalf';
            return '<div class="muscle-chip" data-muscle="' + m + '">' + t(muscleKey) + '</div>';
        }).join('') +
        '</div>' +
        
        myPlanHtml +
        weekPlanHtml +
        
        '<div class="card">' +
        '<h4>📊 ' + t('homeRecentWeight') + '</h4>' +
        '<div id="weightPreview">' + weightHtml + '</div></div>' +
        
        '<div class="card">' +
        '<h3>📏 ' + t('homeBodyFatCalc') + '</h3>' +
        '<p style="color:#aaa; font-size:0.8rem;">' + t('homeUsNavyHint') + '</p>' +
        '<div class="form-row">' +
        '<input type="number" id="bfHomeWeight" placeholder="' + t('homeWeightKg') + '" step="0.1">' +
        '<input type="number" id="bfHomeWaist" placeholder="' + t('waistCm') + '" step="0.1">' +
        '<input type="number" id="bfHomeNeck" placeholder="' + t('neckCm') + '" step="0.1">' +
        '<input type="number" id="bfHomeHeight" placeholder="' + t('homeHeightCm') + '" step="1"></div>' +
        '<select id="bfHomeGender">' +
        '<option value="male">' + t('homeMale') + '</option>' +
        '<option value="female">' + t('homeFemale') + '</option></select>' +
        '<button class="btn" id="calcHomeBodyFatBtn">' + t('homeCalcBodyFat') + '</button>' +
        '<div id="homeBodyFatResult"></div></div></div>';
}

function renderTrainPage() {
    const defaultMuscles = getDailyRecommendation();
    currentSelectedMuscles = [...defaultMuscles];
    
    return '' +
        '<div class="page-title">' +
        t('trainTitle') +
        '<small>' + t('trainSubtitle') + '</small></div>' +
        '<div class="container">' +
        '<div class="card">' +
        '<div class="card-title">' + t('trainQuickPreset') + '</div>' +
        '<div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px;" id="splitPresets">' +
        Object.keys(TRAINING_SPLITS).map(function(name) {
            // 获取翻译后的方案名称
            var translatedName = name;
            if (name === '全身基础 3练') translatedName = t('splitFullBody');
            else if (name === '器械低难度 3练') translatedName = t('splitMachine');
            else if (name === '推·拉·腿 3练') translatedName = t('splitPPL');
            else if (name === '上下二分化 4练') translatedName = t('splitUpperLower');
            else if (name === '五分化训练 5练') translatedName = t('splitFiveDay');
            else if (name === '高频增肌 5练') translatedName = t('splitHighFreq');
            return '<button class="btn-small split-preset-btn" data-split="' + name + '" style="background:#2A3655; color:#fff; border:1px solid #3A4675; padding:6px 12px; border-radius:20px; cursor:pointer; font-size:0.75rem; white-space:nowrap;">' + translatedName + '</button>';
        }).join('') +
        '</div>' +
        '<div id="splitDetail" style="color:#aaa; font-size:0.8rem; margin-bottom:10px; display:none;"></div></div>' +
        '<div class="card">' +
        '<div class="card-title">' + t('trainSelectMuscles') + '</div>' +
        '<div class="muscle-grid" id="trainMuscleSelector">' +
        MUSCLES_SIMPLE.map(function(m) {
            var muscleKey = '';
            if (m === '胸部') muscleKey = 'muscleChest';
            else if (m === '背部') muscleKey = 'muscleBack';
            else if (m === '肩膀') muscleKey = 'muscleShoulder';
            else if (m === '手臂(二头)') muscleKey = 'muscleBicep';
            else if (m === '手臂(三头)') muscleKey = 'muscleTricep';
            else if (m === '腹部') muscleKey = 'muscleAbs';
            else if (m === '大腿前侧') muscleKey = 'muscleQuad';
            else if (m === '大腿后侧') muscleKey = 'muscleHamstring';
            else if (m === '臀部') muscleKey = 'muscleGlute';
            else if (m === '小腿') muscleKey = 'muscleCalf';
            return '<div class="muscle-chip ' + (currentSelectedMuscles.includes(m) ? 'selected' : '') + '" data-muscle="' + m + '">' + t(muscleKey) + '</div>';
        }).join('') +
        '</div>' +
        '<button class="btn" id="generatePlanBtn">' + t('trainGeneratePlan') + '</button>' +
        '<div id="planContainer"></div>' +
        '<button class="btn btn-outline" id="completeWorkoutBtn" style="margin-top: 1rem;">' + t('trainCompleteWorkout') + '</button></div>' +
        '<div class="card">' +
        '<h3>📋 ' + t('trainTodayCompleted') + '</h3>' +
        '<div id="todayWorkoutSummary">' + t('commonLoading') + '</div></div></div>';
}

function renderExerciseList(exercises, container) {
    var totalEstimatedCalories = exercises.reduce(function(sum, ex) { return sum + (ex.caloriesPerSet * ex.sets); }, 0);
    
    var html = '<p style="margin-bottom: 1rem; color: #00D4FF;">' + t('trainTotalActions', {count: exercises.length, cal: totalEstimatedCalories}) + '</p>';
    html += '<p style="color:#aaa; font-size:0.75rem; margin-bottom:10px;">' + t('trainClickInputHint') + '</p>';
    html += '<div style="max-height: 500px; overflow-y: auto;">';
    for (var idx = 0; idx < exercises.length; idx++) {
        var ex = exercises[idx];
        var defaultWeight = ex.defaultWeight || ex.caloriesPerSet * 5 || 20;
        var restSeconds = ex.rest || 60;
        var repsStr = typeof ex.reps === 'string' ? ex.reps.replace(/\D/g,'') : ex.reps;
        var defaultReps = parseInt(repsStr) || 10;
        var gifKeyword = (ex.gifSearch || t(ex.name) + ' exercise').replace(/'/g, "\\'");
        var videoUrl = ex.youtube || 'https://www.youtube.com/results?search_query=' + encodeURIComponent(t(ex.name) + ' 训练');
        html += '<div class="exercise-item">' +
            '<input type="checkbox" class="checkbox-custom" id="ex_' + idx + '" data-calories="' + (ex.caloriesPerSet * ex.sets) + '">' +
            '<div style="flex:1">' +
            '<div class="exercise-name">🏋️ ' + t(ex.name) +
            '<span class="equipment-badge">' + (ex.equipment || '') + '</span>' +
            '<a href="' + videoUrl + '" target="_blank" class="youtube-link" style="margin-left: 8px;">🔍 ' + t('searchVideo') + '</a>' +
            '<button class="btn-small gif-btn" onclick="showGifModal(\'' + gifKeyword + '\')" style="background:#FF69B4; color:#fff; padding:2px 8px; font-size:0.7rem; border:none; border-radius:6px; cursor:pointer; margin-left:4px;">🎬 ' + t('gifButton') + '</button>' +
            '</div>' +
            '<div class="exercise-detail">📖 ' + (t('instr' + ex.name) || ex.instruction || '') + '</div>' +
            '<div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap; align-items:center;">' +
            '<div style="display:flex; align-items:center; gap:4px; background:#0E1428; padding:4px 10px; border-radius:8px;">' +
            '<span style="font-size:0.75rem; color:#aaa;">🏋️' + t('weightLabel') + '</span>' +
            '<input type="number" class="ex-weight-input" data-idx="' + idx + '" value="' + defaultWeight + '" min="0" step="1" style="width:55px; padding:4px 6px; border-radius:6px; font-size:0.8rem;">' +
            '<span style="font-size:0.7rem; color:#666;">' + t('kgUnit') + '</span></div>' +
            '<div style="display:flex; align-items:center; gap:4px; background:#0E1428; padding:4px 10px; border-radius:8px;">' +
            '<span style="font-size:0.75rem; color:#aaa;">🔢' + t('repsLabel') + '</span>' +
            '<input type="number" class="ex-reps-input" data-idx="' + idx + '" value="' + defaultReps + '" min="1" step="1" style="width:50px; padding:4px 6px; border-radius:6px; font-size:0.8rem;">' +
            '<span style="font-size:0.7rem; color:#666;">' + t('repsUnit') + '</span></div>' +
            '<div style="display:flex; align-items:center; gap:4px; background:#0E1428; padding:4px 10px; border-radius:8px;">' +
            '<span style="font-size:0.75rem; color:#aaa;">⏱️' + t('restLabel') + '</span>' +
            '<input type="number" class="ex-rest-input" data-idx="' + idx + '" value="' + restSeconds + '" min="5" step="5" style="width:50px; padding:4px 6px; border-radius:6px; font-size:0.8rem;">' +
            '<span style="font-size:0.7rem; color:#666;">' + t('restSecondsUnit') + '</span></div></div>' +
            '<div style="margin-top: 8px; display:flex; align-items:center; gap:8px; flex-wrap:wrap;">' +
            '<button class="btn-small btn-set" data-ex-idx="' + idx + '" data-set="1" style="background:#2A3655;">✅ ' + t('group') + ' 1</button>' +
            '<button class="btn-small btn-set" data-ex-idx="' + idx + '" data-set="2" style="background:#2A3655;">✅ ' + t('group') + ' 2</button>' +
            '<button class="btn-small btn-set" data-ex-idx="' + idx + '" data-set="3" style="background:#2A3655;">✅ ' + t('group') + ' 3</button>' +
            '<button class="btn-small btn-set" data-ex-idx="' + idx + '" data-set="4" style="background:#2A3655;">✅ ' + t('group') + ' 4</button>' +
            '<span class="rest-timer" id="restTimer_' + idx + '" style="color:#FFD700; font-weight:bold; display:none;">⏱️ ' + t('restLabel') + ' 0' + t('restSecondsUnit') + '</span>' +
            '</div></div></div>';
    }
    html += '</div>';
    container.innerHTML = html;
    
    document.querySelectorAll('.btn-set').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var exIdx = parseInt(this.dataset.exIdx);
            var ex = currentExercises[exIdx];
            if (!ex) return;
            
            this.style.background = '#00E5B2';
            this.textContent = '✅ ' + t('commonComplete');
            this.disabled = true;
            
            var restInput = document.querySelector('.ex-rest-input[data-idx="' + exIdx + '"]');
            var restSec = restInput ? parseInt(restInput.value) || (ex.rest || 60) : (ex.rest || 60);
            var timerEl = document.getElementById('restTimer_' + exIdx);
            if (timerEl) {
                timerEl.style.display = 'inline';
                timerEl.textContent = '⏱️ ' + t('restLabel') + ' ' + restSec + t('restSecondsUnit');
                
                startSetRestTimer(exIdx, restSec, function(remaining) {
                    timerEl.textContent = '⏱️ ' + t('restLabel') + ' ' + remaining + t('restSecondsUnit');
                    if (remaining <= 0) {
                        timerEl.textContent = '⏱️ ' + t('trainRestEnd');
                        timerEl.style.color = '#00E5B2';
                        try {
                            var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                            var osc = audioCtx.createOscillator();
                            osc.type = 'sine';
                            osc.frequency.setValueAtTime(880, audioCtx.currentTime);
                            osc.connect(audioCtx.destination);
                            osc.start();
                            osc.stop(audioCtx.currentTime + 0.3);
                        } catch(e) {}
                    }
                }, function() {
                    setTimeout(function() {
                        timerEl.style.display = 'none';
                        timerEl.style.color = '#FFD700';
                    }, 3000);
                });
            }
        });
    });
    
    loadTodayCompletedExercises();
}

function updatePlanUI(musclesArray) {
    currentSelectedMuscles = musclesArray;
    var exercises = getExercisesForMuscles(musclesArray);
    currentExercises = exercises;
    var container = document.getElementById('planContainer');
    if (!container) return;
    
    if (exercises.length === 0) {
        container.innerHTML = '<div class="card">⚠️ ' + t('trainNoExercises') + '</div>';
        return;
    }
    
    renderExerciseList(exercises, container);
}

function loadTodayCompletedExercises() {
    var todayWorkout = getWorkoutByDate(getTodayStr());
    if (todayWorkout && todayWorkout.exercises) {
        var completedNames = todayWorkout.exercises.map(function(e) { return e.name; });
        for (var i = 0; i < currentExercises.length; i++) {
            var chk = document.getElementById('ex_' + i);
            if (chk && completedNames.includes(currentExercises[i].name)) {
                chk.checked = true;
            }
        }
    }
    updateTodayWorkoutSummary();
}

function updateTodayWorkoutSummary() {
    var container = document.getElementById('todayWorkoutSummary');
    if (!container) return;
    var todayWorkout = getWorkoutByDate(getTodayStr());
    if (!todayWorkout || !todayWorkout.exercises || todayWorkout.exercises.length === 0) {
        container.innerHTML = '<p style="color:#aaa">' + t('trainNoComplete') + '</p>';
        return;
    }
    var exercises = todayWorkout.exercises;
    var html = '<div style="background:#0E1428; border-radius:16px; padding:1rem;">';
    html += '<p style="color:#00E5B2">✅ ' + t('trainTodaySummary', {count: exercises.length, cal: todayWorkout.totalCalories || 0}) + '</p>';
    exercises.forEach(function(ex) {
        html += '<div style="margin:8px 0">• ' + t(ex.name) + ' · ' + ex.sets + t('wkSetsUnit') + ' × ' + repsDisplay(ex.reps) + ' · ' + ex.calories + t('kcalUnit') + '</div>';
    });
    html += '<button class="btn-small btn-danger" id="deleteTodayWorkoutBtn" style="margin-top:10px;">' + t('trainDeleteTodayRecord') + '</button>';
    html += '</div>';
    container.innerHTML = html;
    
    var deleteBtn = document.getElementById('deleteTodayWorkoutBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            if (confirm(t('trainConfirmDeleteToday'))) {
                deleteWorkout(getTodayStr());
                updateTodayWorkoutSummary();
                alert(t('trainDeletedTodayRecord'));
            }
        });
    }
}

function completeWorkout() {
    var completedExercises = [];
    var totalCalories = 0;
    for (var i = 0; i < currentExercises.length; i++) {
        var chk = document.getElementById('ex_' + i);
        if (chk && chk.checked) {
            var weightInput = document.querySelector('.ex-weight-input[data-idx="' + i + '"]');
            var repsInput = document.querySelector('.ex-reps-input[data-idx="' + i + '"]');
            var customWeight = weightInput ? parseFloat(weightInput.value) || 20 : 20;
            var customReps = repsInput ? parseInt(repsInput.value) || 10 : 10;
            
            var calories = currentExercises[i].caloriesPerSet * currentExercises[i].sets;
            totalCalories += calories;
            completedExercises.push({
                name: currentExercises[i].name,
                target: "组合训练",
                sets: currentExercises[i].sets,
                reps: customReps + t('wkRepsUnit'),
                weight: customWeight,
                calories: calories
            });
        }
    }
    if (completedExercises.length === 0) {
        alert(t('trainCheckOne'));
        return;
    }
    var today = getTodayStr();
    saveWorkout(today, completedExercises, totalCalories);
    
    var planExercises = currentExercises.map(function(ex, i) {
        var weightInput = document.querySelector('.ex-weight-input[data-idx="' + i + '"]');
        var repsInput = document.querySelector('.ex-reps-input[data-idx="' + i + '"]');
        return {
            name: ex.name,
            target: "组合训练",
            sets: ex.sets,
            reps: (repsInput ? parseInt(repsInput.value) || 10 : 10) + t('repsUnit'),
            weight: weightInput ? parseFloat(weightInput.value) || 20 : 20,
            calories: ex.caloriesPerSet * ex.sets
        };
    });
    saveMyPlan(planExercises);
    
    var weekPlanSource = localStorage.getItem("fitness_weekplan_source");
    if (weekPlanSource) {
        var source = JSON.parse(weekPlanSource);
        if (source && source.day) {
            var completedNames = completedExercises.map(function(e) { return e.name; });
            var completedInPlan = source.exercises.filter(function(ex) {
                return completedNames.indexOf(ex.name) !== -1;
            });
            if (completedInPlan.length > 0) {
                var confirmMsg = t('trainUpdateWeekplan', {count: completedInPlan.length, day: source.day});
                if (confirm(confirmMsg)) {
                    var weekPlan = getWeekPlan();
                    if (!weekPlan[source.day]) weekPlan[source.day] = [];
                    completedExercises.forEach(function(ce) {
                        var existing = weekPlan[source.day].find(function(e) { return e.name === ce.name; });
                        if (existing) {
                            existing.weight = ce.weight;
                            existing.reps = ce.reps;
                            existing.sets = ce.sets;
                        } else {
                            weekPlan[source.day].push({
                                name: ce.name,
                                sets: ce.sets,
                                reps: ce.reps,
                                weight: ce.weight,
                                rest: 60,
                                caloriesPerSet: Math.round(ce.calories / ce.sets) || 5
                            });
                        }
                    });
                    saveWeekPlan(weekPlan);
                    alert(t('trainWeekplanUpdated', {day: source.day}));
                }
            }
        }
        localStorage.removeItem("fitness_weekplan_source");
    }
    
    alert(t('trainWorkoutDone', {count: completedExercises.length, cal: totalCalories}));
    updateTodayWorkoutSummary();
}

function renderCardioPage() {
    var todayRun = getRunByDate(getTodayStr());
    var last30DaysRuns = getLast30DaysRuns();
    var weightLogs = getWeightLogs();
    var currentWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : 70;
    var totalKm30 = last30DaysRuns.reduce(function(sum, r) { return sum + r.km; }, 0);
    var totalCal30 = last30DaysRuns.reduce(function(sum, r) { return sum + r.calories; }, 0);
    
    var runsListHtml = last30DaysRuns.slice().reverse().map(function(r) {
        return '<div class="run-item" data-date="' + r.date + '">' +
            '<span>📅 ' + r.date + ' · ' + r.km + t('kmUnit') + ' · ' + r.calories + t('kcalUnit') + '</span>' +
            '<div class="run-actions">' +
            '<button class="edit-run" data-date="' + r.date + '" data-km="' + r.km + '" data-cal="' + r.calories + '">✏️ ' + t('commonEdit') + '</button>' +
            '<button class="delete-run" data-date="' + r.date + '">🗑️ ' + t('commonDelete') + '</button>' +
            '</div></div>';
    }).join('');
    
    return '<div class="page-title">' +
        t('cardioTitle') +
        '<small>' + t('cardioSubtitle') + '</small></div>' +
        '<div class="container">' +
        '<div class="card">' +
        '<div class="card-title">📝 ' + t('cardioRecord') + '</div>' +
        (todayRun ? '<p style="color:#00E5B2">✅ ' + t('cardioTodayDone', {km: todayRun.km, cal: todayRun.calories}) + '</p>' : '') +
        '<div class="location-btn" id="startLocationBtn">📍 ' + t('cardioGpsStart') + '</div>' +
        '<div class="location-btn" id="endLocationBtn" style="display:none;">🏁 ' + t('cardioGpsEnd') + '</div>' +
        '<div id="gpsStatus" style="color:#aaa; margin: 0.5rem 0;"></div>' +
        '<hr style="margin: 1rem 0; border-color:#2A3655;">' +
        '<input type="number" id="runKm" placeholder="' + t('cardioManual') + '" step="0.1">' +
        '<div id="runCaloriesPreview" style="color:#aaa; margin: 0.5rem 0;"></div>' +
        '<button class="btn" id="saveRunBtn">✅ ' + t('cardioSave') + '</button></div>' +
        '<div class="card">' +
        '<h3>📊 ' + t('cardioStats') + '</h3>' +
        '<p>' + t('cardioTotalDist') + ': ' + totalKm30.toFixed(1) + ' ' + t('kmUnit') + '</p>' +
        '<p>' + t('cardioTotalCal') + ': ' + totalCal30 + ' ' + t('kcalUnit') + '</p>' +
        '<p>' + t('cardioAvg') + ': ' + (totalKm30/30).toFixed(1) + ' ' + t('kmUnit') + '</p>' +
        '<div id="recentRunsList" style="max-height: 300px; overflow-y: auto; margin-top: 1rem;">' +
        (runsListHtml || t('cardioNoRecords')) +
        '</div></div></div>';
}

function renderNutritionPage() {
    var todayIntake = getTodayIntake();
    
    return '<div class="page-title">' +
        t('nutritionTitle') +
        '<small>' + t('nutritionSubtitle') + '</small></div>' +
        '<div class="container">' +
        '<div class="card">' +
        '<div class="card-title">🔥 ' + t('nutritionGoal') + '</div>' +
        '<button class="tab-btn ' + (currentNutritionTab === 'weightLoss' ? 'active' : '') + '" data-tab="weightLoss">🔥 ' + t('nutritionWeightLoss') + '</button>' +
        '<button class="tab-btn ' + (currentNutritionTab === 'muscleGain' ? 'active' : '') + '" data-tab="muscleGain">💪 ' + t('nutritionMuscleGain') + '</button>' +
        '<button class="tab-btn ' + (currentNutritionTab === 'healthy' ? 'active' : '') + '" data-tab="healthy">🌿 ' + t('nutritionHealthy') + '</button>' +
        '</div>' +
        '<div class="form-row">' +
        '<input type="number" id="nutriWeight" placeholder="' + t('homeWeightKg') + '" step="0.1">' +
        '<input type="number" id="nutriHeight" placeholder="' + t('homeHeightCm') + '" step="1">' +
        '<input type="number" id="nutriAge" placeholder="' + t('homeAge') + '" step="1"></div>' +
        '<select id="nutriGender"><option value="male">' + t('homeMale') + '</option><option value="female">' + t('homeFemale') + '</option></select>' +
        '<select id="nutriActivity">' +
        '<option value="sedentary">' + t('homeSedentary') + '</option>' +
        '<option value="light">' + t('homeLight') + '</option>' +
        '<option value="moderate">' + t('homeModerate') + '</option>' +
        '<option value="active">' + t('homeActive') + '</option>' +
        '<option value="veryActive">' + t('homeVeryActive') + '</option></select>' +
        '<button class="btn" id="calculateNutritionBtn">' + t('nutritionCalc') + '</button>' +
        '<div id="nutritionResult"></div></div>' +
        
        '<div class="card">' +
        '<h3>🍎 ' + t('nutritionFoodSearch') + '</h3>' +
        '<input type="text" id="foodSearchInput" placeholder="' + t('nutritionSearchPlaceholder') + '" onkeyup="searchFoods()">' +
        '<div id="foodResults" style="max-height: 300px; overflow-y: auto; margin-top: 1rem;">' +
        FOOD_DATABASE.map(function(food) {
            return '<div class="food-item">' +
                '<input type="checkbox" class="food-checkbox" data-name="' + food.name + '" data-base="' + food.baseAmount + '" data-unit="' + food.unit + '" data-cal="' + food.caloriesPerUnit + '" data-protein="' + food.proteinPerUnit + '" data-type="' + food.type + '">' +
                '<span class="food-name">' + t(food.name) + '</span>' +
                '<input type="number" class="quantity-input" placeholder="' + t('nutritionQuantity') + ' (' + t(food.unit) + ')" value="1" min="0.1" step="0.1">' +
                '<span class="food-calories">🔥 ' + food.caloriesPerUnit + t('kcalUnit') + '/' + food.baseAmount + t(food.unit) + ' · 💪 ' + food.proteinPerUnit + t('gram') + '</span>' +
                '</div>';
        }).join('') +
        '</div>' +
        '<button class="btn" id="addSelectedFoodsBtn">➕ ' + t('nutritionAdd') + '</button>' +
        '<div id="selectedFoods" style="margin-top: 1rem;">' +
        '<h4>📝 ' + t('nutritionTodayIntake') + '</h4>' +
        '<div id="dailyIntakeList"></div>' +
        '<div id="dailyTotal" style="margin-top: 0.5rem; padding: 0.5rem; background: #0E1428; border-radius: 12px;"></div>' +
        '<button class="btn-small btn-danger" id="clearTodayIntakeBtn">🗑️ ' + t('nutritionClear') + '</button>' +
        '</div></div></div>';
}

function renderLibrary() {
    var accordions = '';
    for (var mi = 0; mi < MUSCLES_SIMPLE.length; mi++) {
        var muscle = MUSCLES_SIMPLE[mi];
        var exList = WORKOUT_PLANS[muscle];
        if (!exList) continue;
        accordions += '<div class="accordion">' +
            '<div class="accordion-header">💪 ' + t(getMuscleKey(muscle)) + ' (' + exList.length + t('wkCountUnit') + ') <span style="float:right">▼</span></div>' +
            '<div class="accordion-content">' +
            exList.map(function(ex) {
                var searchQuery = encodeURIComponent(t(ex.name));
                var gifKeyword = (ex.gifSearch || t(ex.name) + ' exercise').replace(/'/g, "\\'");
                return '<div style="border-bottom:1px solid #2A3655; padding:0.8rem 0">' +
                    '<strong>' + t(ex.name) + '</strong> ' +
                    '<span class="equipment-badge">' + ex.equipment + '</span>' +
                    '<button class="btn-small gif-btn" onclick="showGifModal(\'' + gifKeyword + '\')" style="background:#FF69B4; color:#fff; padding:2px 8px; font-size:0.7rem; border:none; border-radius:6px; cursor:pointer; margin-left:6px;">🎬 ' + t('commonWatchGif') + '</button>' +
                    '<br><span style="color:#aaa">' + (t('instr' + ex.name) || ex.instruction) + '</span>' +
                    '<br><small>' + ex.sets + t('setsUnit') + ' × ' + repsDisplay(ex.reps) + ' · ' + t('restLabel') + ex.rest + t('restSecondsUnit') + ' · ' + t('about') + (ex.caloriesPerSet * ex.sets) + t('kcalUnit') + '</small>' +
                    '<br><a href="' + ex.youtube + '" target="_blank" class="youtube-link">🔍 ' + t('commonSearchVideo') + '</a>' +
                    '</div>';
            }).join('') +
            '</div></div>';
    }
    return '<div class="page-title">' +
        t('libraryTitle') +
        '<small>' + t('librarySubtitle') + '</small></div>' +
        '<div class="container">' + accordions + '</div>';
}

function renderProgress() {
    var logs = getWeightLogs();
    var calendar30 = generate30DayCalendar();
    var heatSummary = getLast3DaysHeatSummary();
    
    var todayWorkout = getWorkoutByDate(getTodayStr());
    var todayRun = getRunByDate(getTodayStr());
    var todayHtml = '<div class="card" style="border-left: 4px solid #00D4FF;">';
    todayHtml += '<h3>📅 ' + t('progressTodayStatus') + '</h3>';
    if (todayWorkout) {
        todayHtml += '<p style="color:#00E5B2; font-size:1.1rem;">✅ ' + t('progressTodayDone') + '</p>';
        todayHtml += '<p>' + t('progressCompletedCount', {count: todayWorkout.exercises.length, cal: todayWorkout.totalCalories || 0}) + '</p>';
        var todayMuscles = [];
        for (var ei = 0; ei < todayWorkout.exercises.length; ei++) {
            var ex = todayWorkout.exercises[ei];
            for (var mi = 0; mi < MUSCLES_SIMPLE.length; mi++) {
                var m = MUSCLES_SIMPLE[mi];
                var plans = WORKOUT_PLANS[m] || [];
                if (plans.find(function(p) { return p.name === ex.name; })) {
                    if (todayMuscles.indexOf(m) === -1) todayMuscles.push(m);
                    break;
                }
            }
        }
        if (todayMuscles.length > 0) {
            todayHtml += '<p>🏋️ ' + t('progressTodayMuscles') + ': <span style="color:#00D4FF;">' + todayMuscles.map(function(tm) { return t(getMuscleKey(tm)); }).join(' · ') + '</span></p>';
        }
        todayHtml += '<button class="btn-small btn-danger" id="deleteTodayWorkoutBtn2" style="margin-top:6px;">🗑️ ' + t('commonDelete') + '</button>';
    } else {
        todayHtml += '<p style="color:#FF8888;">❌ ' + t('progressNoTrain') + '</p>';
        todayHtml += '<button class="btn btn-small" id="goTrainFromProgressBtn">🔥 ' + t('progressGoTrain') + '</button>';
    }
    if (todayRun) {
        todayHtml += '<p style="color:#00E5B2;">🏃 ' + t('progressTodayRun', {km: todayRun.km, cal: todayRun.calories}) + '</p>';
    }
    todayHtml += '</div>';
    
    var muscleStats = getMuscleStats();
    var sortedMuscles = MUSCLES_SIMPLE.slice().sort(function(a, b) {
        return (muscleStats[b] && muscleStats[b].totalSets || 0) - (muscleStats[a] && muscleStats[a].totalSets || 0);
    });
    var muscleStatsHtml = '<div class="card"><h3>🏋️ ' + t('progressMuscleStats') + '</h3>';
    muscleStatsHtml += '<div style="display:flex; flex-direction:column; gap:8px; max-height:400px; overflow-y:auto;">';
    for (var mi = 0; mi < sortedMuscles.length; mi++) {
        var m = sortedMuscles[mi];
        var stat = muscleStats[m];
        if (!stat || stat.totalSets === 0) {
            muscleStatsHtml += '<div style="padding:10px; background:#0E1428; border-radius:12px; display:flex; justify-content:space-between; align-items:center;">' +
                '<span>' + t(getMuscleKey(m)) + '</span><span style="color:#666;">' + t('progressNoData') + '</span></div>';
            continue;
        }
        var setsBarWidth = Math.min(100, stat.totalSets / 5);
        muscleStatsHtml += '<div style="padding:10px; background:#0E1428; border-radius:12px;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">' +
            '<span><strong>' + t(getMuscleKey(m)) + '</strong></span>' +
            '<span style="color:#aaa; font-size:0.8rem;">' + t('progressTotalSets') + ' ' + stat.totalSets + ' ' + t('progressSetsUnit') + '</span></div>' +
            '<div style="background:#1A2235; border-radius:8px; height:6px; overflow:hidden;">' +
            '<div style="width:' + setsBarWidth + '%; background:#00D4FF; height:100%; border-radius:8px;"></div></div>' +
            '<div style="display:flex; gap:12px; margin-top:4px; font-size:0.75rem; color:#aaa;">' +
            '<span>🏆 ' + t('progressBest') + ': ' + (stat.bestWeight > 0 ? stat.bestWeight + t('kgUnit') + ' (' + stat.bestWeightExercise + ')' : t('progressNone')) + '</span>' +
            '<span>📅 ' + t('progressTrainedDays') + ' ' + Object.keys(stat.dates).length + ' ' + t('commonDay') + '</span></div></div>';
    }
    muscleStatsHtml += '</div></div>';
    
    var chartHtml = '<div class="card"><h3>📈 ' + t('progressChart') + '</h3>';
    chartHtml += '<div style="display:flex; gap:8px; margin-bottom:12px;" id="chartTabButtons">' +
        '<button class="btn-small chart-tab active" data-period="daily" style="background:#00D4FF; color:#000; border:none; padding:6px 16px; border-radius:20px; cursor:pointer;">📅 ' + t('progressDaily') + '</button>' +
        '<button class="btn-small chart-tab" data-period="monthly" style="background:#2A3655; color:#fff; border:none; padding:6px 16px; border-radius:20px; cursor:pointer;">📆 ' + t('progressMonthly') + '</button>' +
        '<button class="btn-small chart-tab" data-period="yearly" style="background:#2A3655; color:#fff; border:none; padding:6px 16px; border-radius:20px; cursor:pointer;">📊 ' + t('progressYearly') + '</button>' +
        '</div>';
    chartHtml += '<div id="chartContainer" style="width:100%; height:250px; background:#0E1428; border-radius:12px; position:relative;">' +
        '<canvas id="growthChart" width="700" height="250" style="width:100%; height:250px;"></canvas></div>';
    chartHtml += '<div id="chartLegend" style="display:flex; gap:16px; margin-top:8px; font-size:0.75rem; color:#aaa;"></div>';
    chartHtml += '</div>';
    
    var heatHtml = '<div style="display: flex; flex-direction: column; gap: 12px;">';
    for (var hi = 0; hi < heatSummary.length; hi++) {
        var day = heatSummary[hi];
        var barWidth = Math.min(100, Math.abs(day.net) / 50);
        var barColor = day.net < 0 ? '#00E5B2' : (day.net > 100 ? '#FF8888' : '#FFD700');
        var netText = day.net < 0 ? '🔥 ' + (-day.net) + ' ' + t('progressDeficit') : (day.net > 0 ? '📈 ' + day.net + ' ' + t('progressSurplus') : '⚖️ 0');
        heatHtml += '<div style="background: #1A2235; border-radius: 16px; padding: 12px;">' +
            '<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">' +
            '<span style="font-weight: bold; color: #00D4FF;">📅 ' + day.displayDate + '</span>' +
            '<span style="color: #aaa;">🍽️ ' + day.intake + ' / 🏃 ' + day.expenditure + '</span>' +
            '<span style="color: ' + day.statusColor + ';">' + netText + '</span></div>' +
            '<div style="background: #0E1428; border-radius: 12px; overflow: hidden; height: 8px;">' +
            '<div style="width: ' + barWidth + '%; background: ' + barColor + '; height: 100%;"></div></div>' +
            '<div style="display: flex; justify-content: space-between; margin-top: 6px; font-size: 0.7rem;">' +
            '<span>' + t('homeIntake') + ' ' + day.intake + t('kcalUnit') + '</span>' +
            '<span>' + t('homeExpenditure') + ' ' + day.expenditure + t('kcalUnit') + '</span></div></div>';
    }
    heatHtml += '</div>';
    
    var calendarHtml = '<div class="calendar-grid">';
    var weekdays = [t('monShort'), t('tueShort'), t('wedShort'), t('thuShort'), t('friShort'), t('satShort'), t('sunShort')];
    calendarHtml += weekdays.map(function(d) { return '<div style="color:#00D4FF; font-size:0.7rem; text-align:center;">' + d + '</div>'; }).join('');
    
    for (var ci = 0; ci < calendar30.length; ci++) {
        var day = calendar30[ci];
        var workout = getWorkoutByDate(day.dateStr);
        var run = getRunByDate(day.dateStr);
        var hasActivity = workout || run;
        var summary = '';
        if (workout) summary += '💪 ' + workout.totalCalories + t('kcalUnit') + ' ';
        if (run) summary += '🏃 ' + run.calories + t('kcalUnit');
        var classes = 'cal-day ' + (hasActivity ? 'has-workout' : '') + ' ' + (day.isToday ? 'today' : '');
        calendarHtml += '<div class="' + classes + '">' +
            day.date.getDate() +
            (hasActivity ? '<div class="workout-summary">' + summary + '</div>' : '') +
            '</div>';
    }
    calendarHtml += '</div>';
    
    var weightHtml = logs.slice(-7).reverse().map(function(l) { return '<div>' + l.date + ' → ' + l.weight + ' ' + t('progressKg') + '</div>'; }).join('') || t('progressNoData');
    
    return '<div class="page-title">' + t('progressTitle') + '<small>' + t('progressSubtitle') + '</small></div>' +
        '<div class="container">' +
        todayHtml +
        muscleStatsHtml +
        chartHtml +
        '<div class="card"><h3>🔥 ' + t('progressHeatSummary') + '</h3>' +
        '<p style="color:#aaa; font-size:0.8rem; margin-bottom:1rem;">📊 ' + t('progressHeatHint') + '</p>' +
        heatHtml + '</div>' +
        '<div class="card"><h3>⚖️ ' + t('progressWeight') + '</h3>' +
        '<input type="number" id="weightInput" step="0.1" placeholder="' + t('progressWeightPlaceholder') + '" />' +
        '<button class="btn" id="saveWeightBtn">💾 ' + t('progressSaveWeight') + '</button>' +
        '<h4 style="margin-top:1rem">' + t('progressRecentWeight') + '</h4>' +
        weightHtml + '</div>' +
        '<div class="card"><h3>🗓️ ' + t('progressCalendar') + '</h3>' +
        '<p style="color:#aaa; font-size:0.8rem">🟢 ' + t('progressCalendarHint') + '</p>' +
        calendarHtml + '</div></div>';
}

function renderYearSummaryPage() {
    var summary = getYearSummary();
    var currentMonth = new Date().getMonth() + 1;
    var weightChange = summary.startWeight && summary.currentWeight ? (summary.currentWeight - summary.startWeight).toFixed(1) : null;
    var bodyFatChange = summary.startBodyFat && summary.currentBodyFat ? (summary.currentBodyFat - summary.startBodyFat).toFixed(1) : null;
    
    var monthlyData = getMonthlyBodyChanges();
    
    var photosHtml = summary.photos.map(function(p) {
        return '<div style="display:inline-block; margin:10px; text-align:center;">' +
            '<img src="' + p.data + '" class="progress-photo" style="max-width:200px;">' +
            '<br><small>' + p.date + '</small>' +
            '<button class="btn-small btn-danger" onclick="deleteProgressPhoto(' + p.id + ')">' + t('commonDelete') + '</button></div>';
    }).join('');
    
    var currentYearMonth = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0');
    var currentMonthData = monthlyData.find(function(m) { return m.month === currentYearMonth; }) || { month: currentYearMonth, weight: '', bodyFat: '', waist: '', muscle: '', notes: '' };
    
    var monthlyFormHtml = '<div class="card">' +
        '<h3>📝 ' + t('yearMonthlyRecord') + '</h3>' +
        '<p style="color:#aaa; font-size:0.8rem;">' + t('yearMonthlyHint') + '</p>' +
        '<div class="form-row"><input type="month" id="recordMonth" value="' + currentYearMonth + '"></div>' +
        '<div class="form-row">' +
        '<input type="number" id="monthWeight" placeholder="' + t('homeWeightKg') + '" value="' + (currentMonthData.weight || '') + '" step="0.1">' +
        '<input type="number" id="monthBodyFat" placeholder="' + t('yearBodyFatPercent') + '" value="' + (currentMonthData.bodyFat || '') + '" step="0.1">' +
        '<input type="number" id="monthWaist" placeholder="' + t('yearWaistCm') + '" value="' + (currentMonthData.waist || '') + '" step="0.1">' +
        '<input type="number" id="monthMuscle" placeholder="' + t('yearMuscleKg') + '" value="' + (currentMonthData.muscle || '') + '" step="0.1"></div>' +
        '<div style="background: #0E1428; border-radius: 12px; padding: 12px; margin: 10px 0;">' +
        '<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">' +
        '<span style="color: #00D4FF;">📊 ' + t('yearMuscleEstimator') + '</span>' +
        '<select id="fitnessLevelSelect" style="width: auto; padding: 5px 10px;">' +
        '<option value="beginner">' + t('yearBeginner') + '</option>' +
        '<option value="intermediate">' + t('yearIntermediate') + '</option>' +
        '<option value="advanced">' + t('yearAdvanced') + '</option></select>' +
        '<button class="btn-small" id="estimateMuscleBtn" style="padding: 5px 12px;">🔢 ' + t('yearEstimate') + '</button></div>' +
        '<div id="muscleEstimateResult" style="font-size: 0.8rem; margin-top: 8px; color: #aaa;"></div></div>' +
        '<textarea id="monthNotes" rows="2" placeholder="' + t('yearNotesPlaceholder') + '">' + (currentMonthData.notes || '') + '</textarea>' +
        '<button class="btn" id="saveMonthlyRecordBtn">💾 ' + t('commonSave') + '</button></div>';
    
    var monthlyTableHtml = '<div class="card"><h3>📊 ' + t('yearMonthlySummary') + '</h3>';
    monthlyTableHtml += '<div style="overflow-x: auto;"><table style="width:100%; border-collapse: collapse;">' +
        '<thead><tr><th style="padding: 10px; background: #00D4FF20; text-align: left;">' + t('yearMonth') + '</th>' +
        '<th style="padding: 10px; background: #00D4FF20; text-align: left;">' + t('homeWeightKg') + '</th>' +
        '<th style="padding: 10px; background: #00D4FF20; text-align: left;">' + t('yearBodyFatPercent') + '</th>' +
        '<th style="padding: 10px; background: #00D4FF20; text-align: left;">' + t('yearWaistCm') + '</th>' +
        '<th style="padding: 10px; background: #00D4FF20; text-align: left;">' + t('yearMuscleKg') + '</th>' +
        '<th style="padding: 10px; background: #00D4FF20; text-align: left;">' + t('yearChange') + '</th>' +
        '<th style="padding: 10px; background: #00D4FF20; text-align: left;">' + t('commonAction') + '</th></tr></thead><tbody>';
    
    var sortedMonths = [...monthlyData].sort(function(a, b) { return b.month.localeCompare(a.month); });
    for (var smi = 0; smi < sortedMonths.length; smi++) {
        var m = sortedMonths[smi];
        var monthDisplay = m.month;
        var weightChangeText = "";
        var prevMonth = monthlyData.find(function(p) { return p.month === getPreviousMonth(m.month); });
        if (prevMonth && prevMonth.weight && m.weight) {
            var diff = (m.weight - prevMonth.weight).toFixed(1);
            weightChangeText = diff > 0 ? '📈 +' + diff : (diff < 0 ? '📉 ' + diff : '➖');
        }
        monthlyTableHtml += '<tr style="border-bottom: 1px solid #2A3655;">' +
            '<td style="padding: 10px; color: #00D4FF;">' + monthDisplay + '</td>' +
            '<td style="padding: 10px;">' + (m.weight || '-') + '</td>' +
            '<td style="padding: 10px;">' + (m.bodyFat || '-') + '</td>' +
            '<td style="padding: 10px;">' + (m.waist || '-') + '</td>' +
            '<td style="padding: 10px;">' + (m.muscle || '-') + '</td>' +
            '<td style="padding: 10px; color: ' + (weightChangeText.includes('+') ? '#FF8888' : (weightChangeText.includes('-') ? '#00E5B2' : '#aaa')) + '">' + weightChangeText + '</td>' +
            '<td style="padding: 10px;"><button class="btn-small btn-danger" onclick="window.deleteMonthlyRecord(\'' + m.month + '\')" style="padding: 4px 8px;">' + t('commonDelete') + '</button></td></tr>';
    }
    if (sortedMonths.length === 0) {
        monthlyTableHtml += '<tr><td colspan="7" style="padding: 20px; text-align: center; color: #aaa;">' + t('progressNoData') + '</td></tr>';
    }
    monthlyTableHtml += '</tbody></table></div></div>';
    
    var bodyFatCalculatorHtml = '<div class="card">' +
        '<h3>📏 ' + t('homeBodyFatCalc') + '</h3>' +
        '<p style="color:#aaa; font-size:0.8rem;">' + t('homeUsNavyHint') + '</p>' +
        '<div class="form-row">' +
        '<input type="number" id="bfWeight" placeholder="' + t('homeWeightKg') + '" step="0.1">' +
        '<input type="number" id="bfWaist" placeholder="' + t('yearWaistCm') + '" step="0.1">' +
        '<input type="number" id="bfNeck" placeholder="' + t('yearNeckCm') + '" step="0.1">' +
        '<input type="number" id="bfHeight" placeholder="' + t('homeHeightCm') + '" step="1"></div>' +
        '<select id="bfGender"><option value="male">' + t('homeMale') + '</option><option value="female">' + t('homeFemale') + '</option></select>' +
        '<button class="btn" id="calcBodyFatBtn">📊 ' + t('homeCalcBodyFat') + '</button>' +
        '<div id="bodyFatResult"></div></div>';
    
    return '<div class="page-title">' + t('yearTitle') + '<small>' + t('yearSubtitle') + '</small></div>' +
        '<div class="container"><h2>📅 ' + t('yearFitnessSummary') + '</h2>' +
        '<div class="card"><h3>⚖️ ' + t('yearWeightChange') + '</h3>' +
        '<div class="form-row">' +
        '<input type="number" id="startWeight" placeholder="' + t('yearStartWeight') + '" value="' + (summary.startWeight || '') + '" step="0.1">' +
        '<input type="number" id="currentWeight" placeholder="' + t('yearCurrentWeight') + '" value="' + (summary.currentWeight || '') + '" step="0.1"></div>' +
        (weightChange !== null ? '<p style="margin-top:0.5rem;">📉 ' + t('yearWeightChangeResult') + ': ' + (weightChange > 0 ? '📈 ' + t('yearWeightGain') : '📉 ' + t('yearWeightLoss')) + ' ' + Math.abs(weightChange) + ' ' + t('progressKg') + '</p>' : '') +
        '<button class="btn" id="saveWeightYearBtn">💾 ' + t('yearSaveWeight') + '</button></div>' +
        '<div class="card"><h3>💪 ' + t('yearBodyFatChange') + '</h3>' +
        '<div class="form-row">' +
        '<input type="number" id="startBodyFat" placeholder="' + t('yearStartBodyFat') + '" value="' + (summary.startBodyFat || '') + '" step="0.1">' +
        '<input type="number" id="currentBodyFat" placeholder="' + t('yearCurrentBodyFat') + '" value="' + (summary.currentBodyFat || '') + '" step="0.1"></div>' +
        '<select id="bodyFatGenderSelect"><option value="male">' + t('homeMale') + '</option><option value="female">' + t('homeFemale') + '</option></select>' +
        (bodyFatChange !== null ? '<p style="margin-top:0.5rem;">📊 ' + t('yearBodyFatChangeResult') + ': ' + (bodyFatChange > 0 ? '📈 ' + t('yearUp') : '📉 ' + t('yearDown')) + ' ' + Math.abs(bodyFatChange) + '%</p>' : '') +
        '<button class="btn" id="saveBodyFatYearBtn">💾 ' + t('yearSaveBodyFat') + '</button>' +
        '<div id="bodyFatEvaluation"></div></div>' +
        bodyFatCalculatorHtml +
        monthlyFormHtml +
        monthlyTableHtml +
        '<div class="card"><h3>📸 ' + t('yearPhotos') + '</h3>' +
        '<input type="file" id="photoUpload" accept="image/*">' +
        '<button class="btn" id="uploadPhotoBtn">📷 ' + t('yearUpload') + '</button>' +
        '<div id="photosGallery" style="margin-top: 1rem;">' + (photosHtml || '<p>' + t('yearNoPhotos') + '</p>') + '</div></div>' +
        '<div class="card"><h3>📝 ' + t('yearNotes') + '</h3>' +
        '<textarea id="yearNotes" rows="4" placeholder="' + t('yearNotesPlaceholder2') + '">' + (summary.notes || '') + '</textarea>' +
        '<button class="btn" id="saveYearNotesBtn">💾 ' + t('commonSave') + '</button></div></div>';
}

function renderContactPage() {
    var comments = getComments();
    
    return '<div class="page-title">' + t('contactTitle') + '<small>' + t('contactSubtitle') + '</small></div>' +
        '<div class="container">' +
        '<div class="card" style="text-align: center;">' +
        '<h2>📧 ' + t('contactUs') + '</h2>' +
        '<p style="font-size: 1.2rem; margin: 1rem 0;">📩 <a href="mailto:zayya58800@gmail.com" style="color: #00D4FF;">zayya58800@gmail.com</a></p>' +
        '<p>' + t('contactDesc') + '</p></div>' +
        '<div class="card"><h3>💬 ' + t('contactComments') + '</h3>' +
        '<div id="commentsList" style="max-height: 300px; overflow-y: auto; margin-bottom: 1rem;">' +
        (comments.slice().reverse().map(function(c) {
            return '<div class="comment-item"><span class="comment-name">' + escapeHtml(c.name) + '</span>' +
                '<span class="comment-time">' + c.time + '</span><p style="margin-top: 0.5rem;">' + escapeHtml(c.comment) + '</p></div>';
        }).join('') || '<p style="color:#aaa">' + t('contactNoComments') + '</p>') +
        '</div>' +
        '<input type="text" id="commentName" placeholder="' + t('contactNamePlaceholder') + '" style="margin-bottom: 0.5rem;">' +
        '<textarea id="commentContent" rows="3" placeholder="' + t('contactCommentPlaceholder') + '"></textarea>' +
        '<button class="btn" id="submitCommentBtn">📝 ' + t('contactSubmit') + '</button></div></div>';
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
    var todayIntake = getTodayIntake();
    var listContainer = document.getElementById('dailyIntakeList');
    var totalContainer = document.getElementById('dailyTotal');
    
    if (listContainer) {
        listContainer.innerHTML = todayIntake.items.map(function(item, idx) {
            return '<div class="intake-item">' +
                '<span>🍽️ ' + item.name + ' · ' + item.quantity + item.unit + ' · ' + item.calories + t('kcalUnit') + ' · ' + item.protein + 'g' + t('gram') + '</span>' +
                '<button class="delete-intake" data-idx="' + idx + '">' + t('commonDelete') + '</button></div>';
        }).join('');
        if (todayIntake.items.length === 0) listContainer.innerHTML = '<p style="color:#aaa">' + t('nutritionNoRecords') + '</p>';
        document.querySelectorAll('.delete-intake').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                var idx = parseInt(btn.dataset.idx);
                deleteFoodIntake(idx);
                updateDailyIntakeDisplay();
            });
        });
    }
    if (totalContainer) {
        totalContainer.innerHTML = '📊 ' + t('nutritionTodayTotal') + ': ' + todayIntake.calories + t('kcalUnit') + ' · ' + todayIntake.protein + 'g' + t('gram') + ' · ' + t('nutritionProtein');
    }
}

function searchFoods() {
    var keyword = document.getElementById('foodSearchInput') && document.getElementById('foodSearchInput').value || '';
    var filtered = searchFood(keyword);
    var container = document.getElementById('foodResults');
    if (container) {
        container.innerHTML = filtered.map(function(food) {
            return '<div class="food-item">' +
                '<input type="checkbox" class="food-checkbox" data-name="' + food.name + '" data-base="' + food.baseAmount + '" data-unit="' + food.unit + '" data-cal="' + food.caloriesPerUnit + '" data-protein="' + food.proteinPerUnit + '" data-type="' + food.type + '">' +
                '<span class="food-name">' + t(food.name) + '</span>' +
                '<input type="number" class="quantity-input" placeholder="' + t('nutritionQuantity') + ' (' + t(food.unit) + ')" value="1" min="0.1" step="0.1">' +
                '<span class="food-calories">🔥 ' + food.caloriesPerUnit + t('kcalUnit') + '/' + food.baseAmount + t(food.unit) + ' · 💪 ' + food.proteinPerUnit + t('gram') + '</span></div>';
        }).join('');
    }
}

// ==================== 事件绑定 ====================
var currentPage = "home";

function navigate(page) {
    currentPage = page;
    var main = document.getElementById('app');
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
    } else if (page === 'weeklyPlan') {
        main.innerHTML = renderWeeklyPlanPage();
        attachWeeklyPlanEvents();
    }
    updateBottomNav(page);
}

function attachHomeEvents() {
    var calcBmrBtn = document.getElementById('calcBmrBtn');
    if (calcBmrBtn) {
        calcBmrBtn.addEventListener('click', function() {
            var height = parseFloat(document.getElementById('bmrHeight').value);
            var weight = parseFloat(document.getElementById('bmrWeight').value);
            var age = parseFloat(document.getElementById('bmrAge').value);
            var gender = document.getElementById('bmrGender').value;
            var activity = document.getElementById('bmrActivity').value;
            if (!height || !weight || !age) {
                alert(t('alertFillAll'));
                return;
            }
            var bmr = calculateBMR(weight, height, age, gender);
            var tdee = calculateTDEE(bmr, activity);
            var cut = getCutCalories(tdee);
            var bulk = getBulkCalories(tdee);
            var activityNames = {
                sedentary: t('homeSedentary'),
                light: t('homeLight'),
                moderate: t('homeModerate'),
                active: t('homeActive'),
                veryActive: t('homeVeryActive')
            };
            var bmrResultDiv = document.getElementById('bmrResult');
            if (bmrResultDiv) {
                bmrResultDiv.innerHTML = '<div class="result-box" style="line-height:1.8;">' +
                    '<p><strong>🔥 ' + t('bmrResult') + ':</strong> <span style="color:#00D4FF; font-size:1.2rem;">' + Math.round(bmr) + '</span> ' + t('kcalPerDay') + '</p>' +
                    '<p><strong>📊 ' + t('tdeeResult') + ':</strong> <span style="color:#00E5B2; font-size:1.2rem;">' + Math.round(tdee) + '</span> ' + t('kcalPerDay') + '</p>' +
                    '<p style="color:#aaa; font-size:0.8rem;">' + t('activityLevel') + ': ' + (activityNames[activity] || activity) + '</p>' +
                    '<hr style="margin:10px 0; border-color:#2A3655;">' +
                    '<p>🎯 ' + t('recommendedIntake') + ':</p>' +
                    '<p>⚖️ ' + t('maintainWeight') + ': <strong style="color:#FFD700;">' + Math.round(tdee) + '</strong> ' + t('kcalPerDay') + '</p>' +
                    '<p>📉 ' + t('cutPhase') + ': <strong style="color:#00E5B2;">' + Math.round(cut) + '</strong> ' + t('kcalPerDay') + ' (TDEE-500)</p>' +
                    '<p>📈 ' + t('bulkPhase') + ': <strong style="color:#FF8888;">' + Math.round(bulk) + '</strong> ' + t('kcalPerDay') + ' (TDEE+250)</p></div>';
            }
        });
    }
    
    var calcBmiBtn = document.getElementById('calcBmiBtn');
    if (calcBmiBtn) {
        calcBmiBtn.addEventListener('click', function() {
            var h = parseFloat(document.getElementById('bmiHeight').value);
            var w = parseFloat(document.getElementById('bmiWeight').value);
            if (h && w) {
                var result = calculateBMI(w, h);
                var bmiResultDiv = document.getElementById('bmiResult');
                if (bmiResultDiv) {
                    bmiResultDiv.innerHTML = '<div class="result-box">' + t('yourBMI') + ': ' + result.bmi + ' · ' + result.status + '</div>';
                }
            } else {
                alert(t('alertFillHeightWeight'));
            }
        });
    }
    
    var calcHomeBodyFatBtn = document.getElementById('calcHomeBodyFatBtn');
    if (calcHomeBodyFatBtn) {
        calcHomeBodyFatBtn.addEventListener('click', function() {
            var weight = parseFloat(document.getElementById('bfHomeWeight').value);
            var waist = parseFloat(document.getElementById('bfHomeWaist').value);
            var neck = parseFloat(document.getElementById('bfHomeNeck').value);
            var height = parseFloat(document.getElementById('bfHomeHeight').value);
            var gender = document.getElementById('bfHomeGender').value;
            if (!weight || !waist || !neck || !height) {
                alert(t('alertFillBodyFatInfo'));
                return;
            }
            var bodyFat = calculateBodyFat(weight, waist, neck, height, gender);
            var status = getBodyFatStatus(bodyFat, gender);
            var homeBodyFatResult = document.getElementById('homeBodyFatResult');
            if (homeBodyFatResult) {
                homeBodyFatResult.innerHTML = '<div class="result-box">' +
                    '<p><strong>📊 ' + t('estimatedBodyFat') + ':</strong> <span style="color:' + status.color + '; font-size:1.2rem;">' + bodyFat + '%</span></p>' +
                    '<p><strong>💡 ' + t('evaluation') + ':</strong> <span style="color:' + status.color + ';">' + status.text + '</span></p>' +
                    '<p><strong>📝 ' + t('suggestion') + ':</strong> ' + status.suggestion + '</p>' +
                    '<hr style="margin: 0.5rem 0; border-color:#2A3655;">' +
                    '<p style="font-size:0.8rem; color:#aaa;">📌 ' + t('bodyFatStandard') + '</p>' +
                    '<p style="font-size:0.8rem; color:#aaa;">📌 ' + t('bodyFatLowerIsClearer') + '</p></div>';
            }
        });
    }
    
    var startTrainBtn = document.getElementById('startTrainBtn');
    if (startTrainBtn) startTrainBtn.addEventListener('click', function() { navigate('train'); });
    
    var goCardioBtn = document.getElementById('goCardioBtn');
    if (goCardioBtn) goCardioBtn.addEventListener('click', function() { navigate('cardio'); });
    
    var loadMyPlanBtn = document.getElementById('loadMyPlanBtn');
    if (loadMyPlanBtn) {
        loadMyPlanBtn.addEventListener('click', function() {
            var myPlan = getMyPlan();
            if (!myPlan || !myPlan.exercises || myPlan.exercises.length === 0) {
                alert(t('alertNoPlanSaved'));
                return;
            }
            navigate('train');
            setTimeout(function() {
                document.querySelectorAll('#trainMuscleSelector .muscle-chip').forEach(function(c) { c.classList.remove('selected'); });
                var planExerciseNames = myPlan.exercises.map(function(e) { return e.name; });
                var targetMuscles = new Set();
                for (var mi = 0; mi < MUSCLES_SIMPLE.length; mi++) {
                    var muscle = MUSCLES_SIMPLE[mi];
                    var exList = getExercisesForMuscles([muscle]);
                    for (var ei = 0; ei < exList.length; ei++) {
                        if (planExerciseNames.includes(exList[ei].name)) {
                            targetMuscles.add(muscle);
                            break;
                        }
                    }
                }
                document.querySelectorAll('#trainMuscleSelector .muscle-chip').forEach(function(c) {
                    if (targetMuscles.has(c.dataset.muscle)) c.classList.add('selected');
                });
                var selected = Array.from(document.querySelectorAll('#trainMuscleSelector .muscle-chip.selected')).map(function(c) { return c.dataset.muscle; });
                updatePlanUI(selected);
            }, 100);
        });
    }
    
    var clearMyPlanBtn = document.getElementById('clearMyPlanBtn');
    if (clearMyPlanBtn) {
        clearMyPlanBtn.addEventListener('click', function() {
            if (confirm(t('alertConfirmClearPlan'))) {
                clearMyPlan();
                navigate('home');
                alert(t('alertPlanCleared'));
            }
        });
    }
    
    document.querySelectorAll('#muscleGridHome .muscle-chip').forEach(function(chip) {
        chip.addEventListener('click', function(e) {
            var muscle = chip.dataset.muscle;
            navigate('train');
            setTimeout(function() {
                var selector = document.querySelectorAll('#trainMuscleSelector .muscle-chip');
                selector.forEach(function(c) { if (c.dataset.muscle === muscle) c.classList.add('selected'); });
                var selected = Array.from(document.querySelectorAll('#trainMuscleSelector .muscle-chip.selected')).map(function(c) { return c.dataset.muscle; });
                updatePlanUI(selected);
            }, 100);
        });
    });
    
    var goWeekPlanBtn = document.getElementById('goWeekPlanBtn');
    if (goWeekPlanBtn) goWeekPlanBtn.addEventListener('click', function() { navigate('weeklyPlan'); });
}

function attachTrainEvents() {
    var container = document.getElementById('trainMuscleSelector');
    if (container) {
        container.querySelectorAll('.muscle-chip').forEach(function(chip) {
            chip.addEventListener('click', function() { chip.classList.toggle('selected'); });
        });
    }
    var generatePlanBtn = document.getElementById('generatePlanBtn');
    if (generatePlanBtn) {
        generatePlanBtn.addEventListener('click', function() {
            localStorage.removeItem("fitness_weekplan_source");
            var selected = Array.from(document.querySelectorAll('#trainMuscleSelector .muscle-chip.selected')).map(function(c) { return c.dataset.muscle; });
            if (selected.length === 0) { alert(t('trainSelectOne')); return; }
            updatePlanUI(selected);
        });
    }
    var completeWorkoutBtn = document.getElementById('completeWorkoutBtn');
    if (completeWorkoutBtn) completeWorkoutBtn.addEventListener('click', completeWorkout);
    
    document.querySelectorAll('.split-preset-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var splitName = this.dataset.split;
            var split = TRAINING_SPLITS[splitName];
            if (!split) return;
            var dayNames = [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')];
            var todayName = dayNames[new Date().getDay()];
            var todayMuscles = split.weekPlan[todayName] || [];
            if (todayMuscles.length === 0) {
                var firstDay = Object.keys(split.weekPlan)[0];
                if (firstDay) todayMuscles = split.weekPlan[firstDay] || [];
            }
            var detailEl = document.getElementById('splitDetail');
            if (detailEl) {
                // 获取预设方案的翻译描述
                var descKey = '';
                if (splitName === '全身基础 3练') descKey = 'splitFullBodyDesc';
                else if (splitName === '器械低难度 3练') descKey = 'splitMachineDesc';
                else if (splitName === '推·拉·腿 3练') descKey = 'splitPPLDesc';
                else if (splitName === '上下二分化 4练') descKey = 'splitUpperLowerDesc';
                else if (splitName === '五分化训练 5练') descKey = 'splitFiveDayDesc';
                else if (splitName === '高频增肌 5练') descKey = 'splitHighFreqDesc';
                // 获取翻译后的方案名称
                var translatedSplitName = splitName;
                if (splitName === '全身基础 3练') translatedSplitName = t('splitFullBody');
                else if (splitName === '器械低难度 3练') translatedSplitName = t('splitMachine');
                else if (splitName === '推·拉·腿 3练') translatedSplitName = t('splitPPL');
                else if (splitName === '上下二分化 4练') translatedSplitName = t('splitUpperLower');
                else if (splitName === '五分化训练 5练') translatedSplitName = t('splitFiveDay');
                else if (splitName === '高频增肌 5练') translatedSplitName = t('splitHighFreq');
                var detailHtml = '<strong>' + translatedSplitName + '</strong> — ' + t(descKey) + '<br>';
                if (todayMuscles.length > 0) {
                    // 翻译肌肉名称
                    var translatedMuscles = todayMuscles.map(function(m) {
                        if (m === '胸部') return t('muscleChest');
                        if (m === '背部') return t('muscleBack');
                        if (m === '肩膀') return t('muscleShoulder');
                        if (m === '手臂(二头)') return t('muscleBicep');
                        if (m === '手臂(三头)') return t('muscleTricep');
                        if (m === '腹部') return t('muscleAbs');
                        if (m === '大腿前侧') return t('muscleQuad');
                        if (m === '大腿后侧') return t('muscleHamstring');
                        if (m === '臀部') return t('muscleGlute');
                        if (m === '小腿') return t('muscleCalf');
                        return m;
                    });
                    detailHtml += t('trainPresetTodayRec') + ' <span style="color:#00D4FF;">' + translatedMuscles.join(' · ') + '</span>';
                } else {
                    detailHtml += '<span style="color:#FF8888;">' + t('trainPresetRestDay') + '</span>';
                }
                detailEl.innerHTML = detailHtml;
                detailEl.style.display = 'block';
            }
            if (todayMuscles.length === 0) return;
            document.querySelectorAll('#trainMuscleSelector .muscle-chip').forEach(function(c) {
                if (todayMuscles.indexOf(c.dataset.muscle) !== -1) c.classList.add('selected');
                else c.classList.remove('selected');
            });
            updatePlanUI(todayMuscles);
        });
    });
    
    var weekPlanSource = localStorage.getItem("fitness_weekplan_source");
    if (weekPlanSource) {
        var source = JSON.parse(weekPlanSource);
        if (source && source.exercises && source.exercises.length > 0) {
            var exercises = source.exercises.map(function(ex) {
                return {
                    name: ex.name,
                    sets: ex.sets,
                    reps: ex.reps,
                    weight: ex.weight || 20,
                    rest: ex.rest || 60,
                    caloriesPerSet: ex.caloriesPerSet || 5,
                    gifSearch: ex.gifSearch || '',
                    youtube: ex.youtube || '',
                    instruction: '',
                    equipment: ''
                };
            });
            for (var ei = 0; ei < exercises.length; ei++) {
                var exObj = exercises[ei];
                for (var mi = 0; mi < MUSCLES_SIMPLE.length; mi++) {
                    var muscle = MUSCLES_SIMPLE[mi];
                    var plans = WORKOUT_PLANS[muscle] || [];
                    var match = plans.find(function(p) { return p.name === exObj.name; });
                    if (match) {
                        exObj.instruction = match.instruction || '';
                        exObj.equipment = match.equipment || '';
                        document.querySelectorAll('#trainMuscleSelector .muscle-chip').forEach(function(c) {
                            if (c.dataset.muscle === muscle) c.classList.add('selected');
                        });
                        break;
                    }
                }
            }
            currentExercises = exercises;
            var planContainer = document.getElementById('planContainer');
            if (planContainer) renderExerciseList(exercises, planContainer);
            loadTodayCompletedExercises();
            return;
        }
    }
    
    var defaultRec = getDailyRecommendation();
    updatePlanUI(defaultRec);
}

function attachCardioEvents() {
    var weightLogs = getWeightLogs();
    var currentWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : 70;
    
    var runKmInput = document.getElementById('runKm');
    if (runKmInput) {
        runKmInput.addEventListener('input', function(e) {
            var km = parseFloat(e.target.value);
            if (km && currentWeight) {
                var cal = calculateRunningCalories(km, currentWeight);
                var previewDiv = document.getElementById('runCaloriesPreview');
                if (previewDiv) previewDiv.innerHTML = t('cardioCaloriesPreview', {cal: cal, weight: currentWeight});
            }
        });
    }
    
    var saveRunBtn = document.getElementById('saveRunBtn');
    if (saveRunBtn) {
        saveRunBtn.addEventListener('click', function() {
            var km = parseFloat(document.getElementById('runKm').value);
            if (!km || km <= 0) { alert(t('alertValidKm')); return; }
            var cal = calculateRunningCalories(km, currentWeight);
            saveRun(getTodayStr(), km, cal);
            alert(t('cardioSaved', {km: km, cal: cal}));
            navigate('cardio');
        });
    }
    
    var startBtn = document.getElementById('startLocationBtn');
    var endBtn = document.getElementById('endLocationBtn');
    var statusDiv = document.getElementById('gpsStatus');
    
    if (startBtn) {
        startBtn.addEventListener('click', async function() {
            if (statusDiv) statusDiv.innerHTML = "📍 " + t('cardioGettingLocation');
            var result = await startRunTracking();
            if (result.success) {
                isTracking = true;
                if (statusDiv) statusDiv.innerHTML = "✅ " + result.message + " " + t('cardioTrackingStarted');
                startBtn.style.display = "none";
                if (endBtn) endBtn.style.display = "block";
            } else {
                if (statusDiv) statusDiv.innerHTML = "❌ " + result.message;
            }
        });
    }
    
    if (endBtn) {
        endBtn.addEventListener('click', async function() {
            if (!isTracking) return;
            if (statusDiv) statusDiv.innerHTML = "📍 " + t('cardioCalculating');
            var result = await endRunTracking();
            if (result.success && result.km > 0) {
                var km = result.km;
                var cal = calculateRunningCalories(km, currentWeight);
                if (statusDiv) statusDiv.innerHTML = t('cardioStatus', {msg: result.message, cal: cal});
                if (runKmInput) runKmInput.value = km.toFixed(2);
                var previewDiv = document.getElementById('runCaloriesPreview');
                if (previewDiv) previewDiv.innerHTML = t('cardioCaloriesPreview', {cal: cal, weight: currentWeight});
                startBtn.style.display = "block";
                endBtn.style.display = "none";
                isTracking = false;
            } else {
                if (statusDiv) statusDiv.innerHTML = "❌ " + (result.message || t('cardioGpsFailed'));
                startBtn.style.display = "block";
                endBtn.style.display = "none";
                isTracking = false;
            }
        });
    }
    
    document.querySelectorAll('.edit-run').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            var date = btn.dataset.date;
            var oldKm = parseFloat(btn.dataset.km);
            var newKm = prompt(t('cardioEditDistance'), oldKm);
            if (newKm && !isNaN(parseFloat(newKm))) {
                var newCal = calculateRunningCalories(parseFloat(newKm), currentWeight);
                updateRun(date, parseFloat(newKm), newCal);
                navigate('cardio');
            }
        });
    });
    
    document.querySelectorAll('.delete-run').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            var date = btn.dataset.date;
            if (confirm(t('cardioConfirmDelete', {date: date}))) {
                deleteRun(date);
                navigate('cardio');
            }
        });
    });
}

function attachNutritionEvents() {
    document.querySelectorAll('.tab-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            currentNutritionTab = btn.dataset.tab;
            document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
        });
    });
    
    var calculateNutritionBtn = document.getElementById('calculateNutritionBtn');
    if (calculateNutritionBtn) {
        calculateNutritionBtn.addEventListener('click', function() {
            var weight = parseFloat(document.getElementById('nutriWeight').value);
            var height = parseFloat(document.getElementById('nutriHeight').value);
            var age = parseFloat(document.getElementById('nutriAge').value);
            var gender = document.getElementById('nutriGender').value;
            var activity = document.getElementById('nutriActivity').value;
            if (!weight || !height || !age) { alert(t('alertFillAll')); return; }
            var bmr = calculateBMR(weight, height, age, gender);
            var tdee = calculateTDEE(bmr, activity);
            var goal = currentNutritionTab === 'weightLoss' ? 'cut' : (currentNutritionTab === 'muscleGain' ? 'bulk' : 'maintain');
            var targetCalories, protein;
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
            var fat = Math.round(targetCalories * 0.25 / 9);
            var carbs = Math.round((targetCalories - (protein * 4) - (fat * 9)) / 4);
            var nutritionResult = document.getElementById('nutritionResult');
            if (nutritionResult) {
                nutritionResult.innerHTML = '<div class="result-box">' +
                    '<p><strong>📊 ' + t('nutritionResultBmr') + ':</strong> ' + Math.round(bmr) + ' ' + t('kcalPerDay') + '</p>' +
                    '<p><strong>🏃 ' + t('nutritionResultTdee') + ':</strong> ' + Math.round(tdee) + ' ' + t('kcalPerDay') + '</p>' +
                    '<p><strong>🎯 ' + t('nutritionResultTarget') + ':</strong> ' + Math.round(targetCalories) + ' ' + t('kcalPerDay') + '</p>' +
                    '<p><strong>💪 ' + t('nutritionResultProtein') + ':</strong> ' + Math.round(protein) + ' ' + t('gram') + ' (' + t('about') + ' ' + Math.round(protein*4) + ' ' + t('kcalUnit') + ')</p>' +
                    '<p><strong>🥑 ' + t('nutritionResultFat') + ':</strong> ' + fat + ' ' + t('gram') + ' (' + t('about') + ' ' + Math.round(fat*9) + ' ' + t('kcalUnit') + ')</p>' +
                    '<p><strong>🍚 ' + t('nutritionResultCarbs') + ':</strong> ' + carbs + ' ' + t('gram') + ' (' + t('about') + ' ' + Math.round(carbs*4) + ' ' + t('kcalUnit') + ')</p></div>';
            }
        });
    }
    
    var addSelectedFoodsBtn = document.getElementById('addSelectedFoodsBtn');
    if (addSelectedFoodsBtn) {
        addSelectedFoodsBtn.addEventListener('click', function() {
            var selectedFoods = [];
            document.querySelectorAll('.food-checkbox:checked').forEach(function(cb) {
                var itemDiv = cb.closest('.food-item');
                var quantityInput = itemDiv.querySelector('.quantity-input');
                var quantity = parseFloat(quantityInput.value) || 1;
                var name = cb.dataset.name;
                var baseAmount = parseFloat(cb.dataset.base);
                var unit = cb.dataset.unit;
                var calPerUnit = parseFloat(cb.dataset.cal);
                var proteinPerUnit = parseFloat(cb.dataset.protein);
                var multiplier = quantity / baseAmount;
                var calories = Math.round(calPerUnit * multiplier);
                var proteinVal = Math.round(proteinPerUnit * multiplier * 10) / 10;
                selectedFoods.push({ name: name, quantity: quantity, unit: unit, calories: calories, protein: proteinVal });
                cb.checked = false;
                if (quantityInput) quantityInput.value = 1;
            });
            if (selectedFoods.length === 0) { alert(t('nutritionSelectFoods')); return; }
            addFoodIntake(selectedFoods);
            updateDailyIntakeDisplay();
        });
    }
    
    var clearTodayIntakeBtn = document.getElementById('clearTodayIntakeBtn');
    if (clearTodayIntakeBtn) {
        clearTodayIntakeBtn.addEventListener('click', function() {
            if (confirm(t('nutritionConfirmClear'))) {
                clearTodayIntake();
                updateDailyIntakeDisplay();
            }
        });
    }
    updateDailyIntakeDisplay();
}

function attachLibraryEvents() {
    document.querySelectorAll('.accordion-header').forEach(function(header) {
        header.addEventListener('click', function() {
            var content = header.nextElementSibling;
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        });
    });
}

// ==================== 成长图绘制 ====================
function drawGrowthChart(period) {
    var canvas = document.getElementById('growthChart');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W = canvas.width;
    var H = canvas.height;
    var padding = { top: 30, right: 20, bottom: 40, left: 50 };
    var chartW = W - padding.left - padding.right;
    var chartH = H - padding.top - padding.bottom;
    
    var allWorkouts = getAllWorkouts();
    var dataPoints = [];
    var now = new Date();
    
    if (period === 'daily') {
        for (var i = 29; i >= 0; i--) {
            var d = new Date(now);
            d.setDate(d.getDate() - i);
            var dateStr = d.toISOString().slice(0, 10);
            var w = allWorkouts[dateStr];
            if (w && w.exercises) {
                var totalSets = 0;
                for (var ei = 0; ei < w.exercises.length; ei++) totalSets += parseInt(w.exercises[ei].sets) || 0;
                dataPoints.push({ label: (d.getMonth()+1) + '/' + d.getDate(), value: totalSets, date: dateStr });
            } else {
                dataPoints.push({ label: (d.getMonth()+1) + '/' + d.getDate(), value: 0, date: dateStr });
            }
        }
    } else if (period === 'monthly') {
        for (var i = 11; i >= 0; i--) {
            var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            var monthKey = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2, '0');
            var totalSets = 0;
            for (var dateKey in allWorkouts) {
                if (dateKey.startsWith(monthKey)) {
                    var w = allWorkouts[dateKey];
                    if (w && w.exercises) {
                        for (var ei = 0; ei < w.exercises.length; ei++) totalSets += parseInt(w.exercises[ei].sets) || 0;
                    }
                }
            }
            dataPoints.push({ label: d.getMonth()+1 + t('monthUnit'), value: totalSets, date: monthKey });
        }
    } else if (period === 'yearly') {
        for (var i = 4; i >= 0; i--) {
            var year = now.getFullYear() - i;
            var totalSets = 0;
            for (var dateKey in allWorkouts) {
                if (dateKey.startsWith(String(year))) {
                    var w = allWorkouts[dateKey];
                    if (w && w.exercises) {
                        for (var ei = 0; ei < w.exercises.length; ei++) totalSets += parseInt(w.exercises[ei].sets) || 0;
                    }
                }
            }
            dataPoints.push({ label: year + t('yearUnit'), value: totalSets, date: String(year) });
        }
    }
    
    ctx.clearRect(0, 0, W, H);
    
    var maxVal = Math.max(1, Math.max.apply(null, dataPoints.map(function(p) { return p.value; })));
    if (maxVal < 5) maxVal = 5;
    
    ctx.strokeStyle = '#1A2235';
    ctx.lineWidth = 1;
    var gridLines = 5;
    for (var i = 0; i <= gridLines; i++) {
        var y = padding.top + (chartH / gridLines) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(W - padding.right, y);
        ctx.stroke();
        ctx.fillStyle = '#666';
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(Math.round(maxVal - (maxVal / gridLines) * i), padding.left - 5, y + 3);
    }
    
    var barWidth = chartW / dataPoints.length * 0.6;
    for (var i = 0; i < dataPoints.length; i++) {
        var dp = dataPoints[i];
        var x = padding.left + (chartW / dataPoints.length) * i + (chartW / dataPoints.length * 0.4) / 2;
        var barH = (dp.value / maxVal) * chartH;
        var y = padding.top + chartH - barH;
        if (dp.value > 0) {
            var gradient = ctx.createLinearGradient(x, y, x, padding.top + chartH);
            if (period === 'yearly') {
                gradient.addColorStop(0, '#FFD700');
                gradient.addColorStop(1, '#FF8C00');
            } else if (period === 'monthly') {
                gradient.addColorStop(0, '#00D4FF');
                gradient.addColorStop(1, '#0088FF');
            } else {
                gradient.addColorStop(0, '#00E5B2');
                gradient.addColorStop(1, '#00AA88');
            }
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, barH, [3, 3, 0, 0]);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(dp.value, x + barWidth / 2, y - 5);
        }
        ctx.fillStyle = '#aaa';
        ctx.font = '9px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(dp.label, x + barWidth / 2, padding.top + chartH + 15);
    }
    
    var legendEl = document.getElementById('chartLegend');
    if (legendEl) {
        var totalSets = dataPoints.reduce(function(sum, p) { return sum + p.value; }, 0);
        var activeDays = dataPoints.filter(function(p) { return p.value > 0; }).length;
        legendEl.innerHTML = '<span>📊 ' + t('totalSets') + ': ' + totalSets + '</span>' +
            '<span>📅 ' + t('trainedDays') + ': ' + activeDays + '</span>' +
            '<span>🏆 ' + t('highest') + ': ' + maxVal + ' ' + t('setsUnit') + '</span>';
    }
}

if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
        var r = Array.isArray(radii) ? radii : [radii, radii, radii, radii];
        var tl = r[0] || 0, tr = r[1] || 0, br = r[2] || 0, bl = r[3] || 0;
        this.moveTo(x + tl, y);
        this.lineTo(x + w - tr, y);
        this.quadraticCurveTo(x + w, y, x + w, y + tr);
        this.lineTo(x + w, y + h - br);
        this.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
        this.lineTo(x + bl, y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - bl);
        this.lineTo(x, y + tl);
        this.quadraticCurveTo(x, y, x + tl, y);
        this.closePath();
        return this;
    };
}

function attachProgressEvents() {
    var saveWeightBtn = document.getElementById('saveWeightBtn');
    if (saveWeightBtn) {
        saveWeightBtn.addEventListener('click', function() {
            var weight = parseFloat(document.getElementById('weightInput').value);
            if (isNaN(weight)) { alert(t('progressAlertInvalidWeight')); return; }
            saveWeight(weight, getTodayStr());
            navigate('progress');
        });
    }
    
    var deleteTodayWorkoutBtn2 = document.getElementById('deleteTodayWorkoutBtn2');
    if (deleteTodayWorkoutBtn2) {
        deleteTodayWorkoutBtn2.addEventListener('click', function() {
            if (confirm(t('progressConfirmDeleteToday'))) {
                deleteWorkout(getTodayStr());
                navigate('progress');
            }
        });
    }
    
    var goTrainFromProgressBtn = document.getElementById('goTrainFromProgressBtn');
    if (goTrainFromProgressBtn) goTrainFromProgressBtn.addEventListener('click', function() { navigate('train'); });
    
    document.querySelectorAll('.chart-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.chart-tab').forEach(function(t) {
                t.style.background = '#2A3655';
                t.style.color = '#fff';
            });
            this.style.background = '#00D4FF';
            this.style.color = '#000';
            var period = this.dataset.period;
            drawGrowthChart(period);
        });
    });
    setTimeout(function() { drawGrowthChart('daily'); }, 100);
}

function attachYearSummaryEvents() {
    var saveWeightYearBtn = document.getElementById('saveWeightYearBtn');
    if (saveWeightYearBtn) {
        saveWeightYearBtn.addEventListener('click', function() {
            var summary = getYearSummary();
            summary.startWeight = parseFloat(document.getElementById('startWeight').value) || null;
            summary.currentWeight = parseFloat(document.getElementById('currentWeight').value) || null;
            saveYearSummary(summary);
            alert(t('alertSaved'));
            navigate('yearSummary');
        });
    }
    
    var saveBodyFatYearBtn = document.getElementById('saveBodyFatYearBtn');
    if (saveBodyFatYearBtn) {
        saveBodyFatYearBtn.addEventListener('click', function() {
            var summary = getYearSummary();
            summary.startBodyFat = parseFloat(document.getElementById('startBodyFat').value) || null;
            summary.currentBodyFat = parseFloat(document.getElementById('currentBodyFat').value) || null;
            saveYearSummary(summary);
            alert(t('alertSaved'));
            navigate('yearSummary');
        });
    }
    
    var saveYearNotesBtn = document.getElementById('saveYearNotesBtn');
    if (saveYearNotesBtn) {
        saveYearNotesBtn.addEventListener('click', function() {
            var summary = getYearSummary();
            summary.notes = document.getElementById('yearNotes').value;
            saveYearSummary(summary);
            alert(t('alertSaved'));
        });
    }
    
    var uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
    if (uploadPhotoBtn) {
        uploadPhotoBtn.addEventListener('click', function() {
            var fileInput = document.getElementById('photoUpload');
            var file = fileInput.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    addProgressPhoto(e.target.result);
                    navigate('yearSummary');
                };
                reader.readAsDataURL(file);
            } else {
                alert(t('yearSelectPhoto'));
            }
        });
    }
    
    var estimateMuscleBtn = document.getElementById('estimateMuscleBtn');
    if (estimateMuscleBtn) {
        estimateMuscleBtn.addEventListener('click', function() {
            var weight = parseFloat(document.getElementById('monthWeight').value);
            var bodyFat = parseFloat(document.getElementById('monthBodyFat').value);
            var gender = document.getElementById('bodyFatGenderSelect') && document.getElementById('bodyFatGenderSelect').value || 'male';
            var fitnessLevel = document.getElementById('fitnessLevelSelect').value;
            if (!weight || !bodyFat) { alert(t('alertFillWeightBodyFat')); return; }
            if (weight <= 0 || bodyFat <= 0 || bodyFat >= 60) { alert(t('alertValidWeightBodyFat')); return; }
            var estimatedMuscle = estimateMuscleMass(weight, bodyFat, gender, fitnessLevel);
            var evaluation = evaluateMuscleMass(estimatedMuscle, weight, gender);
            var muscleEstimateResult = document.getElementById('muscleEstimateResult');
            if (muscleEstimateResult) {
                muscleEstimateResult.innerHTML = '<span style="color: ' + evaluation.color + '">📊 ' + t('estimatedMuscle') + ': ' + estimatedMuscle + ' kg (' + t('bodyWeightPercent') + ' ' + (estimatedMuscle/weight*100).toFixed(1) + '%)</span>' +
                    '<br>💡 ' + evaluation.text + ' · ' + evaluation.suggestion +
                    '<button class="btn-small" id="applyMuscleToRecord" style="margin-top: 5px; padding: 2px 8px;">📝 ' + t('applyToRecord') + '</button>';
                var applyBtn = document.getElementById('applyMuscleToRecord');
                if (applyBtn) {
                    applyBtn.addEventListener('click', function() {
                        document.getElementById('monthMuscle').value = estimatedMuscle;
                        alert(t('progressMuscleSaved', {muscle: estimatedMuscle}));
                    });
                }
            }
        });
    }
    
    var saveMonthlyRecordBtn = document.getElementById('saveMonthlyRecordBtn');
    if (saveMonthlyRecordBtn) {
        saveMonthlyRecordBtn.addEventListener('click', function() {
            var month = document.getElementById('recordMonth').value;
            var weight = parseFloat(document.getElementById('monthWeight').value) || null;
            var bodyFat = parseFloat(document.getElementById('monthBodyFat').value) || null;
            var waist = parseFloat(document.getElementById('monthWaist').value) || null;
            var muscle = parseFloat(document.getElementById('monthMuscle').value) || null;
            var notes = document.getElementById('monthNotes').value;
            if (!month) { alert(t('alertSelectMonth')); return; }
            saveMonthlyRecord(month, weight, bodyFat, waist, muscle, notes);
            alert(t('progressBodyDataSaved', {month: month}));
            navigate('yearSummary');
        });
    }
    
    window.deleteMonthlyRecord = function(month) {
        if (confirm(t('progressConfirmDeleteMonth', {month: month}))) {
            var records = getMonthlyBodyChanges();
            records = records.filter(function(r) { return r.month !== month; });
            localStorage.setItem("fitness_monthly_changes", JSON.stringify(records));
            navigate('yearSummary');
        }
    };
    
    var calcBodyFatBtn = document.getElementById('calcBodyFatBtn');
    if (calcBodyFatBtn) {
        calcBodyFatBtn.addEventListener('click', function() {
            var weight = parseFloat(document.getElementById('bfWeight').value);
            var waist = parseFloat(document.getElementById('bfWaist').value);
            var neck = parseFloat(document.getElementById('bfNeck').value);
            var height = parseFloat(document.getElementById('bfHeight').value);
            var gender = document.getElementById('bfGender').value;
            if (!weight || !waist || !neck || !height) { alert(t('alertFillBodyFatInfo')); return; }
            var bodyFat = calculateBodyFat(weight, waist, neck, height, gender);
            var status = getBodyFatStatus(bodyFat, gender);
            var bodyFatResult = document.getElementById('bodyFatResult');
            if (bodyFatResult) {
                bodyFatResult.innerHTML = '<div class="result-box">' +
                    '<p><strong>📊 ' + t('estimatedBodyFat') + ':</strong> <span style="color:' + status.color + '; font-size:1.2rem;">' + bodyFat + '%</span></p>' +
                    '<p><strong>💡 ' + t('evaluation') + ':</strong> <span style="color:' + status.color + ';">' + status.text + '</span></p>' +
                    '<p><strong>📝 ' + t('suggestion') + ':</strong> ' + status.suggestion + '</p>' +
                    '<hr style="margin: 0.5rem 0; border-color:#2A3655;">' +
                    '<p style="font-size:0.8rem; color:#aaa;">📌 ' + t('bodyFatStandard') + '</p>' +
                    '<p style="font-size:0.8rem; color:#aaa;">📌 ' + t('bodyFatLowerIsClearer') + '</p></div>';
            }
        });
    }
    
    var genderSelect = document.getElementById('bodyFatGenderSelect');
    if (genderSelect) {
        genderSelect.addEventListener('change', function() {
            var summary = getYearSummary();
            if (summary.currentBodyFat) {
                var evaluation = evaluateBodyFat(summary.currentBodyFat, this.value);
                var bodyFatEvaluation = document.getElementById('bodyFatEvaluation');
                if (bodyFatEvaluation) bodyFatEvaluation.innerHTML = '<p class="result-box">💡 ' + t('currentBodyFatEval') + ': ' + evaluation + '</p>';
            }
        });
        var summary = getYearSummary();
        if (summary.currentBodyFat) {
            var evaluation = evaluateBodyFat(summary.currentBodyFat, genderSelect.value);
            var bodyFatEvaluation = document.getElementById('bodyFatEvaluation');
            if (bodyFatEvaluation) bodyFatEvaluation.innerHTML = '<p class="result-box">💡 ' + t('currentBodyFatEval') + ': ' + evaluation + '</p>';
        }
    }
}

function attachContactEvents() {
    var submitCommentBtn = document.getElementById('submitCommentBtn');
    if (submitCommentBtn) {
        submitCommentBtn.addEventListener('click', function() {
            var name = document.getElementById('commentName').value;
            var comment = document.getElementById('commentContent').value;
            if (!comment) { alert(t('contactEnterComment')); return; }
            saveComment(name || t('anonymous'), comment);
            navigate('contact');
        });
    }
}

window.deleteProgressPhoto = function(photoId) {
    if (confirm(t('confirmDeletePhoto'))) {
        deleteProgressPhoto(photoId);
        navigate('yearSummary');
    }
};

function getWeekPlan() {
    var data = localStorage.getItem("fitness_week_plan");
    if (data) return JSON.parse(data);
    var empty = {};
    for (var i = 0; i < WEEK_DAYS.length; i++) empty[WEEK_DAYS[i]] = [];
    return empty;
}

function saveWeekPlan(plan) {
    localStorage.setItem("fitness_week_plan", JSON.stringify(plan));
}

function getDayKey(day) {
    if (day === '周一') return 'mon';
    if (day === '周二') return 'tue';
    if (day === '周三') return 'wed';
    if (day === '周四') return 'thu';
    if (day === '周五') return 'fri';
    if (day === '周六') return 'sat';
    if (day === '周日') return 'sun';
    return 'mon';
}

function getMuscleKey(m) {
    if (m === '胸部') return 'muscleChest';
    if (m === '背部') return 'muscleBack';
    if (m === '肩膀') return 'muscleShoulder';
    if (m === '手臂(二头)') return 'muscleBicep';
    if (m === '手臂(三头)') return 'muscleTricep';
    if (m === '腹部') return 'muscleAbs';
    if (m === '大腿前侧') return 'muscleQuad';
    if (m === '大腿后侧') return 'muscleHamstring';
    if (m === '臀部') return 'muscleGlute';
    if (m === '小腿') return 'muscleCalf';
    return '';
}

function renderWeeklyPlanPage() {
    var weekPlan = getWeekPlan();
    var dayTabs = WEEK_DAYS.map(function(d) {
        var count = (weekPlan[d]||[]).length;
        var dayKey = getDayKey(d);
        return '<button class="tab-btn week-day-tab" data-day="' + d + '" style="flex:1; font-size:0.8rem; padding:8px 4px;">' + t(dayKey) + '<br><small style="color:#aaa;">' + count + t('countUnit') + '</small></button>';
    }).join('');
    var currentDay = WEEK_DAYS[0];
    var dayExercises = weekPlan[currentDay] || [];
    var exListHtml = dayExercises.map(function(ex, i) {
        var videoUrl = ex.youtube || 'https://www.youtube.com/results?search_query=' + encodeURIComponent(t(ex.name) + ' ' + t('wkTrainSearch'));
        var gifKeyword = (ex.gifSearch || t(ex.name) + ' exercise').replace(/'/g, "\\'");
        return '<div class="exercise-item" style="display:flex; align-items:center; gap:8px; padding:10px; border-bottom:1px solid #1A2235;">' +
            '<div style="flex:1;">' +
            '<div style="font-weight:bold;">' + (i+1) + '. 🏋️ ' + t(ex.name) +
            '<button class="btn-small" onclick="window.open(\'' + videoUrl + '\',\'_blank\')" style="background:#00D4FF; color:#000; padding:1px 6px; font-size:0.65rem; border:none; border-radius:4px; cursor:pointer; margin-left:4px;" title="' + t('wkSearchVideo') + '">📺</button>' +
            '<button class="btn-small gif-btn" onclick="showGifModal(\'' + gifKeyword + '\')" style="background:#FF69B4; color:#fff; padding:1px 6px; font-size:0.65rem; border:none; border-radius:4px; cursor:pointer; margin-left:2px;">🎬</button>' +
            '</div>' +
            '<div style="font-size:0.8rem; color:#aaa;">' +
            '<input type="number" class="week-plan-weight" data-day="' + currentDay + '" data-idx="' + i + '" value="' + (ex.weight||20) + '" min="0" step="1" style="width:50px; padding:2px 4px; border-radius:4px; font-size:0.75rem;"> ' + t('kgUnit') + ' × ' +
            '<input type="number" class="week-plan-reps" data-day="' + currentDay + '" data-idx="' + i + '" value="' + (parseInt(ex.reps)||10) + '" min="1" step="1" style="width:45px; padding:2px 4px; border-radius:4px; font-size:0.75rem;"> ' + t('wkRepsUnit') + ' · ' +
            t('trainRestLabel') + ' <input type="number" class="week-plan-rest" data-day="' + currentDay + '" data-idx="' + i + '" value="' + (ex.rest||60) + '" min="5" step="5" style="width:45px; padding:2px 4px; border-radius:4px; font-size:0.75rem;"> ' + t('wkSecondsUnit') +
            '</div></div>' +
            '<button class="btn-small btn-danger week-del-ex" data-day="' + currentDay + '" data-idx="' + i + '" style="padding:2px 8px; font-size:0.7rem;">✕</button></div>';
    }).join('');
    if (dayExercises.length === 0) exListHtml = '<p style="color:#aaa; text-align:center; padding:20px;">' + t('wkNoExercises') + '</p>';
    
    var muscleOptions = '';
    for (var mi = 0; mi < MUSCLES_SIMPLE.length; mi++) {
        var muscle = MUSCLES_SIMPLE[mi];
        var exs = WORKOUT_PLANS[muscle] || [];
        muscleOptions += '<optgroup label="' + t(getMuscleKey(muscle)) + '">';
        for (var ei = 0; ei < exs.length; ei++) {
            muscleOptions += '<option value="' + exs[ei].name + '">' + t(exs[ei].name) + ' (' + exs[ei].equipment + ')</option>';
        }
        muscleOptions += '</optgroup>';
    }
    
    var weekPreviewHtml = '';
    for (var di = 0; di < WEEK_DAYS.length; di++) {
        var d = WEEK_DAYS[di];
        var exs = weekPlan[d] || [];
        if (exs.length === 0) {
            weekPreviewHtml += '<div style="padding:6px; background:#0E1428; border-radius:8px; font-size:0.8rem;"><strong style="color:#00D4FF;">' + t(getDayKey(d)) + '</strong>: <span style="color:#666;">' + t('wkNone') + '</span></div>';
        } else {
            var translatedNames = exs.map(function(e) { return t(e.name); }).join(', ');
            weekPreviewHtml += '<div style="padding:6px; background:#0E1428; border-radius:8px; font-size:0.8rem;"><strong style="color:#00D4FF;">' + t(getDayKey(d)) + '</strong> (' + exs.length + t('wkCountUnit') + '): <span style="color:#aaa;">' + translatedNames + '</span></div>';
        }
    }
    
    return '<div class="page-title">' + t('weekPlanTitle') + '<small>' + t('weekPlanSubtitle') + '</small></div>' +
        '<div class="container">' +
        '<div class="card"><div style="display:flex; gap:4px; flex-wrap:wrap;" id="weekDayTabs">' + dayTabs + '</div></div>' +
        '<div class="card" id="weekDayDetail">' +
        '<div style="display:flex; justify-content:space-between; align-items:center;">' +
        '<h3 id="weekCurrentDayTitle">' + currentDay + '</h3>' +
        '<div><button class="btn-small" id="startWeekDayTrainBtn" style="background:#00D4FF; color:#000;">⚡ ' + t('weekPlanStartBtn') + '</button></div></div>' +
        '<div id="weekDayExercises">' + exListHtml + '</div></div>' +
        '<div class="card"><h4>➕ ' + t('weekPlanAdd') + '</h4>' +
        '<div style="display:flex; gap:8px; flex-wrap:wrap;">' +
        '<select id="weekAddExerciseSelect" style="flex:2; min-width:150px;">' + muscleOptions + '</select>' +
        '<div style="display:flex; gap:4px; align-items:center; flex-wrap:wrap;">' +
        '<input type="number" id="weekAddSets" value="4" min="1" max="10" step="1" style="width:50px; padding:6px; border-radius:6px; font-size:0.75rem;" placeholder="' + t('wkSets') + '">' +
        '<span style="font-size:0.7rem; color:#aaa;">' + t('wkSetsUnit') + '</span></div>' +
        '<button class="btn btn-small" id="weekAddExerciseBtn" style="white-space:nowrap;">➕ ' + t('weekPlanAddBtn') + '</button></div></div>' +
        '<div class="card"><h4>📋 ' + t('weekPlanPreview') + '</h4>' +
        '<div style="display:flex; flex-direction:column; gap:6px;">' + weekPreviewHtml + '</div></div></div>';
}

function attachWeeklyPlanEvents() {
    var currentDay = WEEK_DAYS[0];
    var weekPlan = getWeekPlan();
    
    function refreshDayView(day) {
        currentDay = day;
        document.querySelectorAll('.week-day-tab').forEach(function(t) {
            t.classList.toggle('active', t.dataset.day === day);
        });
        var titleEl = document.getElementById('weekCurrentDayTitle');
        if (titleEl) {
            var dayKey = getDayKey(day);
            titleEl.textContent = t(dayKey);
        }
        var dayExs = weekPlan[day] || [];
        var container = document.getElementById('weekDayExercises');
        if (!container) return;
        if (dayExs.length === 0) {
            container.innerHTML = '<p style="color:#aaa; text-align:center; padding:20px;">' + t('wkNoExercises') + '</p>';
            return;
        }
        container.innerHTML = dayExs.map(function(ex, i) {
            var videoUrl = ex.youtube || 'https://www.youtube.com/results?search_query=' + encodeURIComponent(t(ex.name) + ' ' + t('wkTrainSearch'));
            var gifKeyword = (ex.gifSearch || t(ex.name) + ' exercise').replace(/'/g, "\\'");
            return '<div class="exercise-item" style="display:flex; align-items:center; gap:8px; padding:10px; border-bottom:1px solid #1A2235;">' +
                '<div style="flex:1;"><div style="font-weight:bold;">' + (i+1) + '. 🏋️ ' + t(ex.name) +
                '<button class="btn-small" onclick="window.open(\'' + videoUrl + '\',\'_blank\')" style="background:#00D4FF; color:#000; padding:1px 6px; font-size:0.65rem; border:none; border-radius:4px; cursor:pointer; margin-left:4px;" title="' + t('wkSearchVideo') + '">📺</button>' +
                '<button class="btn-small gif-btn" onclick="showGifModal(\'' + gifKeyword + '\')" style="background:#FF69B4; color:#fff; padding:1px 6px; font-size:0.65rem; border:none; border-radius:4px; cursor:pointer; margin-left:2px;">🎬</button>' +
                '</div><div style="font-size:0.8rem; color:#aaa;">' +
                '<input type="number" class="week-plan-weight" data-day="' + day + '" data-idx="' + i + '" value="' + (ex.weight||20) + '" min="0" step="1" style="width:50px; padding:2px 4px; border-radius:4px; font-size:0.75rem;"> ' + t('kgUnit') + ' × ' +
                '<input type="number" class="week-plan-reps" data-day="' + day + '" data-idx="' + i + '" value="' + (parseInt(ex.reps)||10) + '" min="1" step="1" style="width:45px; padding:2px 4px; border-radius:4px; font-size:0.75rem;"> ' + t('wkRepsUnit') + ' · ' +
                t('trainRestLabel') + ' <input type="number" class="week-plan-rest" data-day="' + day + '" data-idx="' + i + '" value="' + (ex.rest||60) + '" min="5" step="5" style="width:45px; padding:2px 4px; border-radius:4px; font-size:0.75rem;"> ' + t('wkSecondsUnit') +
                '</div></div><button class="btn-small btn-danger week-del-ex" data-day="' + day + '" data-idx="' + i + '" style="padding:2px 8px; font-size:0.7rem;">✕</button></div>';
        }).join('');
        
        document.querySelectorAll('.week-del-ex').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var d = this.dataset.day;
                var idx = parseInt(this.dataset.idx);
                if (confirm(t('wkConfirmDeleteExercise', {day: d}))) {
                    weekPlan[d].splice(idx, 1);
                    saveWeekPlan(weekPlan);
                    refreshDayView(currentDay);
                    updateTabCounts();
                }
            });
        });
        
        document.querySelectorAll('.week-plan-weight, .week-plan-reps, .week-plan-rest').forEach(function(input) {
            input.addEventListener('change', function() {
                var d = this.dataset.day;
                var idx = parseInt(this.dataset.idx);
                var cls = this.className;
                var val = parseFloat(this.value) || 0;
                if (cls.includes('week-plan-weight')) weekPlan[d][idx].weight = val;
                else if (cls.includes('week-plan-reps')) weekPlan[d][idx].reps = val + t('wkRepsUnit');
                else if (cls.includes('week-plan-rest')) weekPlan[d][idx].rest = val;
                saveWeekPlan(weekPlan);
            });
        });
    }
    
    function updateTabCounts() {
        document.querySelectorAll('.week-day-tab').forEach(function(tab) {
            var d = tab.dataset.day;
            var count = (weekPlan[d]||[]).length;
            var dayKey = getDayKey(d);
            tab.innerHTML = t(dayKey) + '<br><small style="color:#aaa;">' + count + t('countUnit') + '</small>';
        });
    }
    
    var tabsContainer = document.getElementById('weekDayTabs');
    if (tabsContainer) {
        tabsContainer.querySelectorAll('.week-day-tab').forEach(function(tab) {
            tab.addEventListener('click', function() { refreshDayView(tab.dataset.day); });
        });
    }
    
    var addExerciseBtn = document.getElementById('weekAddExerciseBtn');
    if (addExerciseBtn) {
        addExerciseBtn.addEventListener('click', function() {
            var select = document.getElementById('weekAddExerciseSelect');
            var exName = select.value;
            var sets = parseInt(document.getElementById('weekAddSets').value) || 4;
            if (!exName) { alert(t('wkSelectExercise')); return; }
            var foundEx = null;
            for (var mi = 0; mi < MUSCLES_SIMPLE.length; mi++) {
                var muscle = MUSCLES_SIMPLE[mi];
                var exs = WORKOUT_PLANS[muscle] || [];
                var match = exs.find(function(e) { return e.name === exName; });
                if (match) { foundEx = Object.assign({}, match, {muscle: muscle}); break; }
            }
            if (!foundEx) { alert(t('wkExerciseNotFound')); return; }
            if (!weekPlan[currentDay]) weekPlan[currentDay] = [];
            weekPlan[currentDay].push({
                name: foundEx.name,
                sets: sets,
                reps: parseInt(foundEx.reps) + t('wkRepsUnit'),
                weight: 20,
                rest: foundEx.rest || 60,
                caloriesPerSet: foundEx.caloriesPerSet || 5,
                gifSearch: foundEx.gifSearch || '',
                youtube: foundEx.youtube || 'https://www.youtube.com/results?search_query=' + encodeURIComponent(foundEx.name + ' ' + t('wkTrainSearch'))
            });
            saveWeekPlan(weekPlan);
            refreshDayView(currentDay);
            updateTabCounts();
        });
    }
    
    var startTrainBtn = document.getElementById('startWeekDayTrainBtn');
    if (startTrainBtn) {
        startTrainBtn.addEventListener('click', function() {
            var dayExs = weekPlan[currentDay] || [];
            if (dayExs.length === 0) { alert(t('wkNoExercises')); return; }
            localStorage.setItem("fitness_weekplan_source", JSON.stringify({
                day: currentDay,
                exercises: dayExs.map(function(ex) {
                    return {
                        name: ex.name,
                        sets: ex.sets,
                        reps: ex.reps,
                        weight: ex.weight || 20,
                        rest: ex.rest || 60,
                        caloriesPerSet: ex.caloriesPerSet || 5,
                        gifSearch: ex.gifSearch || '',
                        youtube: ex.youtube || ''
                    };
                })
            }));
            alert(t('wkLoadedExs', {day: currentDay, count: dayExs.length}));
            navigate('train');
        });
    }
    refreshDayView(WEEK_DAYS[0]);
}

function updateBottomNav(page) {
    document.querySelectorAll('.bottom-nav .nav-item').forEach(function(item) {
        if (item.dataset.page === page) item.classList.add('active');
        else item.classList.remove('active');
    });
    document.querySelectorAll('.nav-links a').forEach(function(a) {
        if (a.dataset.page === page) a.classList.add('active');
        else a.classList.remove('active');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    var burger = document.getElementById('burgerBtn');
    var navLinksDiv = document.getElementById('navLinks');
    if (burger) {
        burger.addEventListener('click', function() { navLinksDiv.classList.toggle('show'); });
    }
    document.querySelectorAll('.nav-links a').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navigate(link.dataset.page);
            if (window.innerWidth <= 768 && navLinksDiv) navLinksDiv.classList.remove('show');
        });
    });
    document.querySelectorAll('.bottom-nav .nav-item').forEach(function(item) {
        item.addEventListener('click', function() { navigate(item.dataset.page); });
    });
    window.searchFoods = searchFoods;
    navigate('home');
});
