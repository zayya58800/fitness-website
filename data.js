// ==================== 肌肉列表 ====================
const MUSCLES_SIMPLE = [
    "胸部", "背部", "肩膀", "手臂(二头)", "手臂(三头)",
    "腹部", "大腿前侧", "大腿后侧", "臀部", "小腿"
];

// ==================== 预设训练方案 ====================
const TRAINING_SPLITS = {
    "全身基础 3练": {
        description: "每周3次，每次练全身，适合新手",
        type: "weekly",
        weekPlan: {
            "周一": ["胸部", "大腿前侧", "手臂(三头)"],
            "周三": ["背部", "大腿后侧", "手臂(二头)"],
            "周五": ["肩膀", "臀部", "腹部"]
        }
    },
    "器械低难度 3练": {
        description: "固定器械为主，动作轨迹固定更安全",
        type: "weekly",
        weekPlan: {
            "周一": ["胸部", "肩膀", "手臂(三头)"],
            "周三": ["背部", "手臂(二头)", "小腿"],
            "周五": ["大腿前侧", "大腿后侧", "腹部"]
        }
    },
    "推·拉·腿 3练": {
        description: "经典三分化，推/拉/腿各一天",
        type: "weekly",
        weekPlan: {
            "周一": ["胸部", "肩膀", "手臂(三头)"],
            "周三": ["背部", "手臂(二头)"],
            "周五": ["大腿前侧", "大腿后侧", "臀部", "小腿"]
        }
    },
    "上下二分化 4练": {
        description: "上肢一天、下肢一天，各练两次",
        type: "weekly",
        weekPlan: {
            "周一": ["胸部", "背部", "肩膀", "手臂(二头)", "手臂(三头)"],
            "周二": ["大腿前侧", "大腿后侧", "臀部", "小腿", "腹部"],
            "周四": ["胸部", "背部", "肩膀", "手臂(二头)", "手臂(三头)"],
            "周五": ["大腿前侧", "大腿后侧", "臀部", "小腿", "腹部"]
        }
    },
    "五分化训练 5练": {
        description: "每天一个部位，经典健美分化",
        type: "weekly",
        weekPlan: {
            "周一": ["胸部"],
            "周二": ["背部"],
            "周三": ["肩膀"],
            "周四": ["手臂(二头)", "手臂(三头)"],
            "周五": ["大腿前侧", "大腿后侧"],
            "周六": ["腹部", "臀部", "小腿"]
        }
    },
    "高频增肌 5练": {
        description: "高频刺激，适合有基础的训练者",
        type: "weekly",
        weekPlan: {
            "周一": ["胸部", "肩膀", "手臂(三头)"],
            "周二": ["背部", "手臂(二头)"],
            "周三": ["大腿前侧", "大腿后侧", "臀部"],
            "周四": ["胸部", "肩膀", "手臂(三头)"],
            "周五": ["背部", "手臂(二头)", "小腿", "腹部"]
        }
    }
};

// ==================== 每个部位6-8个动作 ====================
const WORKOUT_PLANS = {
    "胸部": [
        { name: "exBenchPress", equipment: "杠铃+卧推凳", sets: 4, reps: "8-12", rest: 60, caloriesPerSet: 8, instruction: "躺在平凳上，双手握杠铃略宽于肩，下放至胸部中段，发力推起", gifSearch: "bench press", youtube: "https://www.youtube.com/results?search_query=%E5%8D%A7%E6%8E%A8+%E8%83%B8%E9%83%A8" },
        { name: "exInclinePress", equipment: "哑铃+上斜凳", sets: 4, reps: "8-12", rest: 60, caloriesPerSet: 7, instruction: "上斜30-45度，哑铃从胸两侧推起，重点刺激上胸", gifSearch: "incline dumbbell press", youtube: "https://www.youtube.com/results?search_query=%E4%B8%8A%E6%96%9C%E5%8D%A7%E6%8E%A8" },
        { name: "exPecDeck", equipment: "蝴蝶机", sets: 4, reps: "12-15", rest: 45, caloriesPerSet: 6, instruction: "坐姿，手肘微曲，双手向中间夹，感受胸肌收缩", gifSearch: "pec deck fly", youtube: "https://www.youtube.com/results?search_query=%E8%9D%B4%E8%9D%B6%E6%9C%BA%E5%A4%B9%E8%83%B8" },
        { name: "exDip", equipment: "双杠", sets: 3, reps: "8-12", rest: 60, caloriesPerSet: 7, instruction: "身体前倾，下放至肩部拉伸，胸肌发力推起", gifSearch: "dip exercise chest", youtube: "https://www.youtube.com/results?search_query=%E5%8F%8C%E6%9D%A0%E8%87%82%E5%B1%88%E4%BC%B8" },
        { name: "exChestPress", equipment: "坐姿推胸机", sets: 4, reps: "10-12", rest: 60, caloriesPerSet: 6, instruction: "坐姿，双手向前推，适合新手", gifSearch: "chest press machine", youtube: "https://www.youtube.com/results?search_query=%E5%99%A8%E6%A2%B0%E6%8E%A8%E8%83%B8" },
        { name: "exCableCrossover", equipment: "龙门架", sets: 4, reps: "12-15", rest: 45, caloriesPerSet: 6, instruction: "站姿，双手拉绳索向中间夹，练胸中缝", gifSearch: "cable crossover", youtube: "https://www.youtube.com/results?search_query=%E9%BE%99%E9%97%A8%E6%9E%B6%E5%A4%B9%E8%83%B8" },
        { name: "exDeclinePress", equipment: "哑铃+下斜凳", sets: 3, reps: "8-12", rest: 60, caloriesPerSet: 7, instruction: "下斜姿势，刺激下胸", gifSearch: "decline dumbbell press", youtube: "https://www.youtube.com/results?search_query=%E4%B8%8B%E6%96%9C%E5%8D%A7%E6%8E%A8" },
        { name: "exPushUp", equipment: "自重", sets: 3, reps: "力竭", rest: 45, caloriesPerSet: 5, instruction: "随时随地可做，宽距刺激胸肌外侧", gifSearch: "push up", youtube: "https://www.youtube.com/results?search_query=%E4%BF%AF%E5%8D%A7%E6%92%91+%E8%83%B8%E9%83%A8" }
    ],
    "背部": [
        { name: "exPullUp", equipment: "单杠", sets: 4, reps: "力竭", rest: 90, caloriesPerSet: 8, instruction: "正手宽握，用背阔肌力量上拉至下巴过杠", gifSearch: "pull up", youtube: "https://www.youtube.com/results?search_query=%E5%BC%95%E4%BD%93%E5%90%91%E4%B8%8A" },
        { name: "exLatPulldown", equipment: "高位下拉机", sets: 4, reps: "10-12", rest: 60, caloriesPerSet: 7, instruction: "坐姿，宽握下拉至锁骨，收缩肩胛", gifSearch: "lat pulldown", youtube: "https://www.youtube.com/results?search_query=%E9%AB%98%E4%BD%8D%E4%B8%8B%E6%8B%89" },
        { name: "exSeatedRow", equipment: "坐姿划船机", sets: 4, reps: "10-12", rest: 60, caloriesPerSet: 7, instruction: "坐姿，双手拉至腹部，夹紧背部", gifSearch: "seated cable row", youtube: "https://www.youtube.com/results?search_query=%E5%9D%90%E5%A7%BF%E5%88%92%E8%88%B9" },
        { name: "exBarbellRow", equipment: "杠铃", sets: 4, reps: "8-12", rest: 75, caloriesPerSet: 8, instruction: "俯身约45度，杠铃沿大腿拉向腹部", gifSearch: "barbell row", youtube: "https://www.youtube.com/results?search_query=%E6%9D%A0%E9%93%83%E5%88%92%E8%88%B9" },
        { name: "exDumbbellRow", equipment: "哑铃+平凳", sets: 4, reps: "10-12", rest: 60, caloriesPerSet: 7, instruction: "单手撑凳，另一只手划船，动作幅度大", gifSearch: "dumbbell row", youtube: "https://www.youtube.com/results?search_query=%E5%8D%95%E8%87%82%E5%93%91%E9%93%83%E5%88%92%E8%88%B9" },
        { name: "exTBarRow", equipment: "T杠", sets: 4, reps: "8-12", rest: 75, caloriesPerSet: 8, instruction: "站姿，双手握T杠，拉向腹部", gifSearch: "t bar row", youtube: "https://www.youtube.com/results?search_query=T%E6%9D%A0%E5%88%92%E8%88%B9" },
        { name: "exStraightArmPulldown", equipment: "龙门架", sets: 3, reps: "12-15", rest: 45, caloriesPerSet: 6, instruction: "直臂压杆，孤立刺激背阔肌", gifSearch: "straight arm pulldown", youtube: "https://www.youtube.com/results?search_query=%E7%9B%B4%E8%87%82%E4%B8%8B%E5%8E%8B" },
        { name: "exMachineRow", equipment: "坐姿划船机", sets: 3, reps: "10-12", rest: 60, caloriesPerSet: 6, instruction: "固定器械，适合新手", gifSearch: "seated row machine", youtube: "https://www.youtube.com/results?search_query=%E5%99%A8%E6%A2%B0%E5%88%92%E8%88%B9" }
    ],
    "肩膀": [
        { name: "exSeatedPress", equipment: "哑铃+直角凳", sets: 4, reps: "8-12", rest: 60, caloriesPerSet: 7, instruction: "坐姿，哑铃从肩推至头顶，练整个肩膀", gifSearch: "seated dumbbell press", youtube: "https://www.youtube.com/results?search_query=%E5%9D%90%E5%A7%BF%E5%93%91%E9%93%83%E6%8E%A8%E4%B8%BE" },
        { name: "exBarbellPress", equipment: "杠铃", sets: 4, reps: "8-12", rest: 60, caloriesPerSet: 8, instruction: "站姿或坐姿，杠铃从锁骨推至头顶", gifSearch: "barbell overhead press", youtube: "https://www.youtube.com/results?search_query=%E6%9D%A0%E9%93%83%E6%8E%A8%E4%B8%BE" },
        { name: "exLateralRaise", equipment: "哑铃", sets: 4, reps: "12-15", rest: 45, caloriesPerSet: 5, instruction: "微曲肘，哑铃向两侧抬高至肩膀高度", gifSearch: "dumbbell lateral raise", youtube: "https://www.youtube.com/results?search_query=%E5%93%91%E9%93%83%E4%BE%A7%E5%B9%B3%E4%B8%BE" },
        { name: "exFrontRaise", equipment: "哑铃", sets: 3, reps: "12-15", rest: 45, caloriesPerSet: 5, instruction: "直臂向前抬起，练肩膀前束", gifSearch: "dumbbell front raise", youtube: "https://www.youtube.com/results?search_query=%E5%93%91%E9%93%83%E5%89%8D%E5%B9%B3%E4%B8%BE" },
        { name: "exBentOverRaise", equipment: "哑铃", sets: 4, reps: "12-15", rest: 45, caloriesPerSet: 5, instruction: "俯身，哑铃向两侧抬起，练肩膀后束", gifSearch: "bent over lateral raise", youtube: "https://www.youtube.com/results?search_query=%E4%BF%AF%E8%BA%AB%E9%A3%9E%E9%B8%9F" },
        { name: "exReversePecDeck", equipment: "蝴蝶机", sets: 4, reps: "12-15", rest: 45, caloriesPerSet: 5, instruction: "反向坐，双手向后打开，练肩膀后束", gifSearch: "reverse pec deck fly", youtube: "https://www.youtube.com/results?search_query=%E8%9D%B4%E8%9D%B6%E6%9C%BA%E5%8F%8D%E5%90%91%E9%A3%9E%E9%B8%9F" },
        { name: "exFacePull", equipment: "龙门架+绳索", sets: 4, reps: "12-15", rest: 45, caloriesPerSet: 5, instruction: "绳索拉向额头，外旋肩关节，练后束和肩袖", gifSearch: "face pull", youtube: "https://www.youtube.com/results?search_query=%E9%9D%A2%E6%8B%89+%E8%82%A9%E9%83%A8" },
        { name: "exSmithPress", equipment: "史密斯机", sets: 3, reps: "8-12", rest: 60, caloriesPerSet: 6, instruction: "史密斯机推举，轨迹固定更安全", gifSearch: "smith machine shoulder press", youtube: "https://www.youtube.com/results?search_query=%E5%8F%B2%E5%AF%86%E6%96%AF%E6%9C%BA%E6%8E%A8%E4%B8%BE" }
    ],
    "手臂(二头)": [
        { name: "exBarbellCurl", equipment: "杠铃", sets: 4, reps: "8-12", rest: 60, caloriesPerSet: 5, instruction: "站姿，大臂夹紧，弯举杠铃至肩前", gifSearch: "barbell curl", youtube: "https://www.youtube.com/results?search_query=%E6%9D%A0%E9%93%83%E5%BC%AF%E4%B8%BE" },
        { name: "exAlternatingCurl", equipment: "哑铃", sets: 4, reps: "10-12", rest: 45, caloriesPerSet: 5, instruction: "左右交替弯举，可以更专注", gifSearch: "dumbbell alternating curl", youtube: "https://www.youtube.com/results?search_query=%E5%93%91%E9%93%83%E4%BA%A4%E6%9B%BF%E5%BC%AF%E4%B8%BE" },
        { name: "exPreacherCurl", equipment: "牧师凳+杠铃/哑铃", sets: 3, reps: "10-12", rest: 45, caloriesPerSet: 4, instruction: "手臂架在斜板上，孤立二头", gifSearch: "preacher curl", youtube: "https://www.youtube.com/results?search_query=%E7%89%A7%E5%B8%88%E5%87%B3%E5%BC%AF%E4%B8%BE" },
        { name: "exCableCurl", equipment: "龙门架+绳索", sets: 4, reps: "10-12", rest: 45, caloriesPerSet: 5, instruction: "站姿，绳索弯举，全程保持张力", gifSearch: "cable curl", youtube: "https://www.youtube.com/results?search_query=%E7%BB%B3%E7%B4%A2%E5%BC%AF%E4%B8%BE" },
        { name: "exHammerCurl", equipment: "哑铃", sets: 3, reps: "10-12", rest: 45, caloriesPerSet: 5, instruction: "手心相对弯举，同时练肱肌", gifSearch: "hammer curl", youtube: "https://www.youtube.com/results?search_query=%E9%94%A4%E5%BC%8F%E5%BC%AF%E4%B8%BE" },
        { name: "exConcentrationCurl", equipment: "哑铃", sets: 3, reps: "12-15", rest: 30, caloriesPerSet: 4, instruction: "手肘靠大腿，单手弯举", gifSearch: "concentration curl", youtube: "https://www.youtube.com/results?search_query=%E9%9B%86%E4%B8%AD%E5%BC%AF%E4%B8%BE" },
        { name: "exChinUp", equipment: "单杠", sets: 3, reps: "8-12", rest: 60, caloriesPerSet: 7, instruction: "反手握杠，更多刺激二头", gifSearch: "chin up", youtube: "https://www.youtube.com/results?search_query=%E5%8F%8D%E6%8F%A1%E5%BC%95%E4%BD%93" }
    ],
    "手臂(三头)": [
        { name: "exTricepPushdown", equipment: "龙门架+绳索", sets: 4, reps: "10-15", rest: 45, caloriesPerSet: 5, instruction: "大臂垂直地面，下压绳索至手臂伸直", gifSearch: "tricep pushdown", youtube: "https://www.youtube.com/results?search_query=%E7%BB%B3%E7%B4%A2%E4%B8%8B%E5%8E%8B" },
        { name: "exCloseGripBench", equipment: "杠铃+平凳", sets: 4, reps: "8-12", rest: 60, caloriesPerSet: 7, instruction: "双手窄握，肘部贴近身体", gifSearch: "close grip bench press", youtube: "https://www.youtube.com/results?search_query=%E7%AA%84%E8%B7%9D%E5%8D%A7%E6%8E%A8" },
        { name: "exOverheadExtension", equipment: "哑铃", sets: 3, reps: "10-12", rest: 45, caloriesPerSet: 5, instruction: "双手握哑铃过头，向下弯举", youtube: "https://www.youtube.com/results?search_query=%E8%BF%87%E5%A4%B4%E8%87%82%E5%B1%88%E4%BC%B8", gifSearch: "overhead tricep extension" },
        { name: "exSkullCrusher", equipment: "EZ杠+平凳", sets: 3, reps: "10-12", rest: 45, caloriesPerSet: 5, instruction: "仰卧，杠铃从额头向后弯举", gifSearch: "skull crusher", youtube: "https://www.youtube.com/results?search_query=%E4%BB%B0%E5%8D%A7%E8%87%82%E5%B1%88%E4%BC%B8" },
        { name: "exTricepDip", equipment: "双杠", sets: 3, reps: "8-12", rest: 60, caloriesPerSet: 6, instruction: "身体直立，重点刺激三头", youtube: "https://www.youtube.com/results?search_query=%E5%8F%8C%E6%9D%A0%E8%87%82%E5%B1%88%E4%BC%B8+%E4%B8%89%E5%A4%B4", gifSearch: "tricep dip" },
        { name: "exBenchDip", equipment: "凳子", sets: 3, reps: "12-15", rest: 45, caloriesPerSet: 4, instruction: "双手撑凳，身体下放，自重练三头", youtube: "https://www.youtube.com/results?search_query=%E5%87%B3%E4%B8%8A%E5%8F%8D%E5%B1%88%E4%BC%B8", gifSearch: "bench dip" },
        { name: "exSingleArmPushdown", equipment: "龙门架", sets: 3, reps: "12-15", rest: 30, caloriesPerSet: 4, instruction: "单侧训练，可以更专注", youtube: "https://www.youtube.com/results?search_query=%E5%8D%95%E8%87%82%E7%BB%B3%E7%B4%A2%E4%B8%8B%E5%8E%8B", gifSearch: "single arm tricep pushdown" }
    ],
    "腹部": [
        { name: "exCrunch", equipment: "瑜伽垫", sets: 4, reps: "15-20", rest: 30, caloriesPerSet: 3, instruction: "仰卧屈膝，卷起上背部，腹部收缩", gifSearch: "crunch exercise", youtube: "https://www.youtube.com/results?search_query=%E5%8D%B7%E8%85%B9+%E8%85%B9%E8%82%8C" },
        { name: "exLegRaise", equipment: "瑜伽垫", sets: 4, reps: "12-15", rest: 30, caloriesPerSet: 3, instruction: "仰卧，双腿抬起至90度，练下腹", youtube: "https://www.youtube.com/results?search_query=%E4%BB%B0%E5%8D%A7%E6%8A%AC%E8%85%BF", gifSearch: "leg raise" },
        { name: "exPlank", equipment: "瑜伽垫", sets: 3, reps: "30-60秒", rest: 30, caloriesPerSet: 4, instruction: "肘撑，身体成直线", gifSearch: "plank", youtube: "https://www.youtube.com/results?search_query=%E5%B9%B3%E6%9D%BF%E6%94%AF%E6%92%91" },
        { name: "exHangingLegRaise", equipment: "单杠", sets: 4, reps: "10-15", rest: 45, caloriesPerSet: 5, instruction: "吊在单杠上，抬腿至90度", youtube: "https://www.youtube.com/results?search_query=%E6%82%AC%E5%9E%82%E4%B8%BE%E8%85%BF", gifSearch: "hanging leg raise" },
        { name: "exRussianTwist", equipment: "哑铃片/瑜伽垫", sets: 3, reps: "12-15", rest: 30, caloriesPerSet: 3, instruction: "坐姿，身体后仰，双手交替转向两侧", gifSearch: "russian twist", youtube: "https://www.youtube.com/results?search_query=%E4%BF%84%E7%BD%97%E6%96%AF%E8%BD%AC%E4%BD%93" },
        { name: "exBicycleCrunch", equipment: "瑜伽垫", sets: 3, reps: "20", rest: 30, caloriesPerSet: 4, instruction: "仰卧，脚蹬自行车，手肘碰对侧膝盖", youtube: "https://www.youtube.com/results?search_query=%E7%A9%BA%E4%B8%AD%E8%87%AA%E8%A1%8C%E8%BD%A6", gifSearch: "bicycle crunch" },
        { name: "exVUp", equipment: "瑜伽垫", sets: 3, reps: "10-15", rest: 45, caloriesPerSet: 4, instruction: "手脚同时抬起，身体成V字", youtube: "https://www.youtube.com/results?search_query=V%E5%AD%97%E4%B8%A4%E5%A4%B4%E8%B5%B7", gifSearch: "v sit up" },
        { name: "exCableCrunch", equipment: "龙门架+绳索", sets: 3, reps: "12-15", rest: 30, caloriesPerSet: 4, instruction: "跪姿，绳索下拉卷腹", youtube: "https://www.youtube.com/results?search_query=%E7%BB%B3%E7%B4%A2%E5%8D%B7%E8%85%B9", gifSearch: "cable crunch" }
    ],
    "大腿前侧": [
        { name: "exSquat", equipment: "杠铃+深蹲架", sets: 4, reps: "8-12", rest: 90, caloriesPerSet: 10, instruction: "杠铃后蹲，下蹲至大腿平行地面", gifSearch: "squat", youtube: "https://www.youtube.com/results?search_query=%E6%B7%B1%E8%B9%B2+%E5%A4%A7%E8%85%BF" },
        { name: "exLegPress", equipment: "腿举机", sets: 4, reps: "10-12", rest: 75, caloriesPerSet: 8, instruction: "蹬腿举机，刺激整个大腿", gifSearch: "leg press", youtube: "https://www.youtube.com/results?search_query=%E8%85%BF%E4%B8%BE" },
        { name: "exBulgarianSplitSquat", equipment: "哑铃+凳子", sets: 3, reps: "10-12", rest: 60, caloriesPerSet: 8, instruction: "后脚垫高，前腿下蹲", gifSearch: "bulgarian split squat", youtube: "https://www.youtube.com/results?search_query=%E4%BF%9D%E5%8A%A0%E5%88%A9%E4%BA%9A%E5%88%86%E8%85%BF%E8%B9%B2" },
        { name: "exLegExtension", equipment: "腿屈伸机", sets: 4, reps: "12-15", rest: 45, caloriesPerSet: 6, instruction: "坐姿，小腿向上抬起，孤立股四头肌", youtube: "https://www.youtube.com/results?search_query=%E8%85%BF%E4%BC%B8%E5%B1%95", gifSearch: "leg extension" },
        { name: "exFrontSquat", equipment: "杠铃", sets: 4, reps: "6-10", rest: 90, caloriesPerSet: 9, instruction: "杠铃放前肩，更刺激股四头肌", youtube: "https://www.youtube.com/results?search_query=%E5%89%8D%E8%B9%B2", gifSearch: "front squat" },
        { name: "exLunge", equipment: "哑铃", sets: 3, reps: "12-15", rest: 45, caloriesPerSet: 7, instruction: "前后弓箭步，下蹲至双膝90度", gifSearch: "lunge", youtube: "https://www.youtube.com/results?search_query=%E7%AE%AD%E6%AD%A5%E8%B9%B2" },
        { name: "exHackSquat", equipment: "哈克机", sets: 4, reps: "10-12", rest: 75, caloriesPerSet: 8, instruction: "哈克机，固定轨迹深蹲", gifSearch: "hack squat", youtube: "https://www.youtube.com/results?search_query=%E5%93%88%E5%85%8B%E6%B7%B1%E8%B9%B2" },
        { name: "exGobletSquat", equipment: "哑铃", sets: 3, reps: "10-15", rest: 60, caloriesPerSet: 7, instruction: "双手抱哑铃在胸前下蹲", gifSearch: "goblet squat", youtube: "https://www.youtube.com/results?search_query=%E9%AB%98%E8%84%9A%E6%9D%AF%E6%B7%B1%E8%B9%B2" }
    ],
    "大腿后侧": [
        { name: "exRomanianDeadlift", equipment: "杠铃", sets: 4, reps: "8-12", rest: 75, caloriesPerSet: 9, instruction: "轻弯膝，髋向后推，感受大腿后侧拉伸", gifSearch: "romanian deadlift", youtube: "https://www.youtube.com/results?search_query=%E7%BD%97%E9%A9%AC%E5%B0%BC%E4%BA%9A%E7%A1%AC%E6%8B%89" },
        { name: "exLegCurl", equipment: "俯卧腿弯举机", sets: 4, reps: "10-12", rest: 60, caloriesPerSet: 6, instruction: "俯卧，小腿向后弯举", youtube: "https://www.youtube.com/results?search_query=%E8%85%BF%E5%BC%AF%E4%B8%BE", gifSearch: "leg curl" },
        { name: "exSeatedLegCurl", equipment: "坐姿腿弯举机", sets: 4, reps: "10-12", rest: 60, caloriesPerSet: 6, instruction: "坐姿，小腿向后弯举", gifSearch: "seated leg curl", youtube: "https://www.youtube.com/results?search_query=%E5%9D%90%E5%A7%BF%E8%85%BF%E5%BC%AF%E4%B8%BE" },
        { name: "exStraightLegDeadlift", equipment: "哑铃/杠铃", sets: 3, reps: "10-12", rest: 60, caloriesPerSet: 7, instruction: "膝盖微曲，直腿下放，拉伸腘绳肌", gifSearch: "straight leg deadlift", youtube: "https://www.youtube.com/results?search_query=%E7%9B%B4%E8%85%BF%E7%A1%AC%E6%8B%89" },
        { name: "exNordicCurl", equipment: "瑜伽垫", sets: 3, reps: "6-10", rest: 60, caloriesPerSet: 6, instruction: "膝盖跪地，身体缓慢下放，手撑住", youtube: "https://www.youtube.com/results?search_query=%E5%8C%97%E6%AC%A7%E8%90%BD%E8%85%BF", gifSearch: "nordic curl" },
        { name: "exKettlebellSwing", equipment: "壶铃", sets: 3, reps: "15-20", rest: 45, caloriesPerSet: 8, instruction: "壶铃从胯下摆到胸前，髋部发力", youtube: "https://www.youtube.com/results?search_query=%E5%A3%B6%E9%93%83%E6%91%86%E8%8D%A1", gifSearch: "kettlebell swing" }
    ],
    "臀部": [
        { name: "exHipThrust", equipment: "杠铃+凳子", sets: 4, reps: "8-12", rest: 75, caloriesPerSet: 8, instruction: "上背靠凳，杠铃放髋部，向上顶臀", gifSearch: "hip thrust", youtube: "https://www.youtube.com/results?search_query=%E8%87%80%E6%8E%A8" },
        { name: "exSquat", equipment: "杠铃", sets: 4, reps: "8-12", rest: 90, caloriesPerSet: 10, instruction: "深蹲同时刺激臀大肌", youtube: "https://www.youtube.com/results?search_query=%E6%B7%B1%E8%B9%B2+%E8%87%80", gifSearch: "barbell squat glutes" },
        { name: "exGluteBridge", equipment: "瑜伽垫", sets: 4, reps: "12-15", rest: 45, caloriesPerSet: 5, instruction: "仰卧屈膝，向上顶臀", youtube: "https://www.youtube.com/results?search_query=%E8%87%80%E6%A1%A5", gifSearch: "glute bridge" },
        { name: "exBulgarianSplitSquat", equipment: "哑铃", sets: 3, reps: "10-12", rest: 60, caloriesPerSet: 8, instruction: "单腿下蹲，重点练臀", youtube: "https://www.youtube.com/results?search_query=%E4%BF%9D%E5%8A%A0%E5%88%A9%E4%BA%9A%E5%88%86%E8%85%BF%E8%B9%B2+%E8%87%80", gifSearch: "bulgarian split squat" },
        { name: "exRomanianDeadlift", equipment: "杠铃", sets: 4, reps: "8-12", rest: 75, caloriesPerSet: 9, instruction: "髋主导，刺激臀和腘绳肌", youtube: "https://www.youtube.com/results?search_query=%E7%BD%97%E9%A9%AC%E5%B0%BC%E4%BA%9A%E7%A1%AC%E6%8B%89", gifSearch: "romanian deadlift" },
        { name: "exClamShell", equipment: "弹力带", sets: 3, reps: "15-20", rest: 30, caloriesPerSet: 3, instruction: "侧躺，膝盖开合，练臀中肌", youtube: "https://www.youtube.com/results?search_query=%E8%9A%8C%E5%BC%8F%E5%BC%80%E5%90%88", gifSearch: "clam shell exercise" },
        { name: "exCableKickback", equipment: "龙门架", sets: 3, reps: "12-15", rest: 30, caloriesPerSet: 4, instruction: "站姿，绳索向后抬腿", youtube: "https://www.youtube.com/results?search_query=%E7%BB%B3%E7%B4%A2%E5%90%8E%E6%8A%AC%E8%85%BF", gifSearch: "cable kickback" }
    ],
    "小腿": [
        { name: "exStandingCalfRaise", equipment: "站姿提踵机/台阶", sets: 4, reps: "15-20", rest: 30, caloriesPerSet: 4, instruction: "前脚掌垫高，踮脚尖到最高点", gifSearch: "standing calf raise", youtube: "https://www.youtube.com/results?search_query=%E7%AB%99%E5%A7%BF%E6%8F%90%E8%B9%84" },
        { name: "exSeatedCalfRaise", equipment: "坐姿提踵机", sets: 4, reps: "15-20", rest: 30, caloriesPerSet: 3, instruction: "坐姿，脚尖发力，练比目鱼肌", gifSearch: "seated calf raise", youtube: "https://www.youtube.com/results?search_query=%E5%9D%90%E5%A7%BF%E6%8F%90%E8%B9%84" },
        { name: "exSingleLegCalfRaise", equipment: "台阶", sets: 3, reps: "12-15", rest: 30, caloriesPerSet: 4, instruction: "单腿做，增加强度", youtube: "https://www.youtube.com/results?search_query=%E5%8D%95%E8%85%BF%E6%8F%90%E8%B9%84", gifSearch: "single leg calf raise" },
        { name: "exDonkeyCalfRaise", equipment: "提踵机/人辅助", sets: 3, reps: "15-20", rest: 45, caloriesPerSet: 4, instruction: "俯身，重量压臀部，做提踵", gifSearch: "donkey calf raise", youtube: "https://www.youtube.com/results?search_query=%E9%A9%B4%E5%BC%8F%E6%8F%90%E8%B9%84" },
        { name: "exJumpCalfRaise", equipment: "自重", sets: 3, reps: "20", rest: 30, caloriesPerSet: 5, instruction: "快速踮脚跳，增加爆发力", youtube: "https://www.youtube.com/results?search_query=%E8%B7%B3%E8%B7%83%E6%8F%90%E8%B9%84", gifSearch: "jump calf raise" },
        { name: "exStepCalfRaise", equipment: "台阶", sets: 3, reps: "20", rest: 30, caloriesPerSet: 4, instruction: "台阶边缘做，加大拉伸幅度", gifSearch: "step calf raise", youtube: "https://www.youtube.com/results?search_query=%E5%8F%B0%E9%98%B6%E6%8F%90%E8%B9%84" }
    ]
};

// ==================== 食物热量蛋白质数据库 ====================
const FOOD_DATABASE = [
    { name: "exChickenBreast", baseAmount: 100, unit: "g", caloriesPerUnit: 165, proteinPerUnit: 31, type: "weight" },
    { name: "exEgg", baseAmount: 1, unit: "unitCount", caloriesPerUnit: 70, proteinPerUnit: 6, type: "count" },
    { name: "exBeef", baseAmount: 100, unit: "g", caloriesPerUnit: 250, proteinPerUnit: 26, type: "weight" },
    { name: "exSalmon", baseAmount: 100, unit: "g", caloriesPerUnit: 208, proteinPerUnit: 20, type: "weight" },
    { name: "exTofu", baseAmount: 100, unit: "g", caloriesPerUnit: 76, proteinPerUnit: 8, type: "weight" },
    { name: "exMilk", baseAmount: 250, unit: "ml", caloriesPerUnit: 150, proteinPerUnit: 8, type: "volume" },
    { name: "exGreekYogurt", baseAmount: 100, unit: "g", caloriesPerUnit: 59, proteinPerUnit: 10, type: "weight" },
    { name: "exBrownRice", baseAmount: 100, unit: "g", caloriesPerUnit: 130, proteinPerUnit: 3, type: "weight" },
    { name: "exQuinoa", baseAmount: 100, unit: "g", caloriesPerUnit: 120, proteinPerUnit: 4, type: "weight" },
    { name: "exOats", baseAmount: 50, unit: "g", caloriesPerUnit: 190, proteinPerUnit: 7, type: "weight" },
    { name: "exSweetPotato", baseAmount: 150, unit: "g", caloriesPerUnit: 130, proteinPerUnit: 2, type: "weight" },
    { name: "exBroccoli", baseAmount: 100, unit: "g", caloriesPerUnit: 34, proteinPerUnit: 3, type: "weight" },
    { name: "exAvocado", baseAmount: 1, unit: "unitCount", caloriesPerUnit: 240, proteinPerUnit: 3, type: "count" },
    { name: "exBanana", baseAmount: 1, unit: "unitRoot", caloriesPerUnit: 105, proteinPerUnit: 1, type: "count" },
    { name: "exApple", baseAmount: 1, unit: "unitCount", caloriesPerUnit: 95, proteinPerUnit: 0.5, type: "count" },
    { name: "exPeanutButter", baseAmount: 15, unit: "g", caloriesPerUnit: 90, proteinPerUnit: 4, type: "weight" },
    { name: "exProteinPowder", baseAmount: 1, unit: "unitScoop", caloriesPerUnit: 120, proteinPerUnit: 25, type: "count" },
    { name: "exRice", baseAmount: 150, unit: "g", caloriesPerUnit: 200, proteinPerUnit: 4, type: "weight" },
    { name: "exNoodles", baseAmount: 150, unit: "g", caloriesPerUnit: 220, proteinPerUnit: 6, type: "weight" },
    { name: "exWholeWheatBread", baseAmount: 1, unit: "unitSlice", caloriesPerUnit: 80, proteinPerUnit: 4, type: "count" },
    { name: "exChickenLeg", baseAmount: 1, unit: "unitCount", caloriesPerUnit: 130, proteinPerUnit: 18, type: "count" },
    { name: "exPork", baseAmount: 100, unit: "g", caloriesPerUnit: 242, proteinPerUnit: 20, type: "weight" },
    { name: "exShrimp", baseAmount: 100, unit: "g", caloriesPerUnit: 84, proteinPerUnit: 18, type: "weight" },
    { name: "exDriedTofu", baseAmount: 100, unit: "g", caloriesPerUnit: 150, proteinPerUnit: 16, type: "weight" },
    { name: "exSoyMilk", baseAmount: 250, unit: "ml", caloriesPerUnit: 120, proteinPerUnit: 6, type: "volume" },
    { name: "exOliveOil", baseAmount: 10, unit: "ml", caloriesPerUnit: 90, proteinPerUnit: 0, type: "volume" },
    { name: "exPeanutOil", baseAmount: 10, unit: "ml", caloriesPerUnit: 90, proteinPerUnit: 0, type: "volume" },
    { name: "exButter", baseAmount: 10, unit: "g", caloriesPerUnit: 72, proteinPerUnit: 0, type: "weight" },
    { name: "exSugar", baseAmount: 5, unit: "g", caloriesPerUnit: 20, proteinPerUnit: 0, type: "weight" },
    { name: "exSalt", baseAmount: 1, unit: "g", caloriesPerUnit: 0, proteinPerUnit: 0, type: "weight" }
];

// ==================== 工具函数 ====================
function getExercisesForMuscles(musclesArray) {
    let results = [];
    for (let muscle of musclesArray) {
        let plans = WORKOUT_PLANS[muscle];
        if (plans) {
            let takeCount = Math.min(4, plans.length);
            results.push(...plans.slice(0, takeCount));
        }
    }
    const unique = [];
    const namesSet = new Set();
    for (let ex of results) {
        if (!namesSet.has(ex.name)) {
            namesSet.add(ex.name);
            unique.push(ex);
        }
    }
    return unique;
}

function searchFood(keyword) {
    if (!keyword) return FOOD_DATABASE;
    return FOOD_DATABASE.filter(food => 
        food.name.toLowerCase().includes(keyword.toLowerCase())
    );
}

function calculateFoodAmount(food, quantity) {
    let multiplier = quantity / food.baseAmount;
    return {
        calories: Math.round(food.caloriesPerUnit * multiplier),
        protein: Math.round(food.proteinPerUnit * multiplier * 10) / 10,
        originalQuantity: quantity,
        unit: food.unit
    };
}

// ==================== 自定义计划系统数据结构 ====================

// 动作分类
const EXERCISE_CATEGORIES = {
    area: [
        { value: "all", labelKey: "areaAll" },
        { value: "upper", labelKey: "areaUpper" },
        { value: "lower", labelKey: "areaLower" },
        { value: "core", labelKey: "areaCore" },
        { value: "full", labelKey: "areaFull" }
    ],
    equipment: [
        { value: "all", labelKey: "equipAll" },
        { value: "barbell", labelKey: "equipBarbell" },
        { value: "dumbbell", labelKey: "equipDumbbell" },
        { value: "machine", labelKey: "equipMachine" },
        { value: "bodyweight", labelKey: "equipBodyweight" },
        { value: "cable", labelKey: "equipCable" },
        { value: "kettlebell", labelKey: "equipKettlebell" },
        { value: "band", labelKey: "equipBand" },
        { value: "ezbar", labelKey: "equipEzbar" },
        { value: "medicine", labelKey: "equipMedicine" },
        { value: "yogaball", labelKey: "equipYogaball" },
        { value: "foamroller", labelKey: "equipFoamroller" },
        { value: "other", labelKey: "equipOther" }
    ],
    pattern: [
        { value: "all", labelKey: "patternAll" },
        { value: "horizontalPush", labelKey: "patternHorizontalPush" },
        { value: "horizontalPull", labelKey: "patternHorizontalPull" },
        { value: "verticalPush", labelKey: "patternVerticalPush" },
        { value: "verticalPull", labelKey: "patternVerticalPull" },
        { value: "squat", labelKey: "patternSquat" },
        { value: "loadedCarry", labelKey: "patternLoadedCarry" },
        { value: "cardio", labelKey: "patternCardio" },
        { value: "plyometric", labelKey: "patternPlyometric" }
    ],
    type: [
        { value: "system", labelKey: "typeSystem" },
        { value: "custom", labelKey: "typeCustom" }
    ]
};

// 获取带分类信息的动作库
function getExercisesWithCategories() {
    let exercises = [];
    for (let muscle of MUSCLES_SIMPLE) {
        let plans = WORKOUT_PLANS[muscle] || [];
        for (let ex of plans) {
            exercises.push({
                ...ex,
                muscle: muscle,
                area: getExerciseArea(muscle),
                type: "system",
                pattern: ex.pattern || getDefaultPattern(ex.name, muscle),
                equipment: ex.equipment || "other"
            });
        }
    }
    return exercises;
}

function getExerciseArea(muscle) {
    const upperMuscles = ["胸部", "背部", "肩膀", "手臂(二头)", "手臂(三头)"];
    const lowerMuscles = ["大腿前侧", "大腿后侧", "臀部", "小腿"];
    const coreMuscles = ["腹部"];
    if (upperMuscles.includes(muscle)) return "upper";
    if (lowerMuscles.includes(muscle)) return "lower";
    if (coreMuscles.includes(muscle)) return "core";
    return "full";
}

function getDefaultPattern(name, muscle) {
    const chestPatterns = ["horizontalPush", "verticalPush"];
    const backPatterns = ["horizontalPull", "verticalPull"];
    const legPatterns = ["squat"];
    const abPatterns = ["core"];
    if (muscle === "胸部") return chestPatterns[0];
    if (muscle === "背部") return backPatterns[0];
    if (["大腿前侧", "大腿后侧", "臀部", "小腿"].includes(muscle)) return "squat";
    if (muscle === "腹部") return "core";
    return "horizontalPush";
}

// 自定义计划存储
function getCustomPrograms() {
    let data = localStorage.getItem("fitness_custom_programs");
    return data ? JSON.parse(data) : [];
}

function saveCustomProgram(program) {
    let programs = getCustomPrograms();
    let existingIndex = programs.findIndex(p => p.id === program.id);
    if (existingIndex !== -1) {
        programs[existingIndex] = program;
    } else {
        programs.push(program);
    }
    localStorage.setItem("fitness_custom_programs", JSON.stringify(programs));
    return program;
}

function deleteCustomProgram(programId) {
    let programs = getCustomPrograms();
    programs = programs.filter(p => p.id !== programId);
    localStorage.setItem("fitness_custom_programs", JSON.stringify(programs));
}

function getCustomProgram(programId) {
    let programs = getCustomPrograms();
    return programs.find(p => p.id === programId);
}

// ==================== 日程系统数据结构 ====================

// 获取所有计划日程（计划 + 训练记录）
function getScheduleEvents() {
    let events = [];
    // 只有进行中且设置了开始日期的计划才在日程显示
    let programs = getCustomPrograms();
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let program of programs) {
        // 只有状态为 active（进行中）的计划才在日程显示
        if (program.status !== 'active') continue;
        if (!program.scheduleStartDate) continue;
        
        let startDate = new Date(program.scheduleStartDate);
        startDate.setHours(0, 0, 0, 0);
        
        for (let weekIdx = 0; weekIdx < program.weeks.length; weekIdx++) {
            let week = program.weeks[weekIdx];
            for (let dayIdx = 0; dayIdx < week.days.length; dayIdx++) {
                let day = week.days[dayIdx];
                // 计算该训练日的实际日期：开始日期 + 周数偏移 + 天数偏移
                // 使用简单的 dayIdx 而不是 day.dayOfWeek，确保日期计算正确
                let dayOffset = (weekIdx * 7) + dayIdx;
                let eventDate = new Date(startDate);
                eventDate.setDate(startDate.getDate() + dayOffset);
                eventDate.setHours(0, 0, 0, 0);
                
                // 只显示今天及未来的训练日
                if (eventDate < today) continue;
                
                let isCompleted = checkTrainingDayCompleted(program.id, weekIdx, dayIdx);
                events.push({
                    id: `${program.id}_w${weekIdx}_d${dayIdx}`,
                    type: "program",
                    programId: program.id,
                    programName: program.name,
                    weekIndex: weekIdx,
                    weekName: week.name,
                    dayIndex: dayIdx,
                    dayName: day.name || `第${dayIdx+1}天`,
                    date: eventDate.toISOString().slice(0, 10),
                    exercises: day.exercises || [],
                    status: isCompleted ? "completed" : "pending"
                });
            }
        }
    }
    
    // 按日期排序
    events.sort(function(a, b) { return a.date.localeCompare(b.date); });
    return events;
}

function getScheduleEventsByDate(dateStr) {
    let events = getScheduleEvents();
    // 只返回未完成的训练日
    return events.filter(e => e.date === dateStr && e.status !== 'completed');
}

// ==================== 动作搜索 ====================

function searchExercises(keyword, filters) {
    let exercises = getExercisesWithCategories();
    
    if (keyword) {
        let lowerKeyword = keyword.toLowerCase();
        exercises = exercises.filter(ex => 
            t(ex.name).toLowerCase().includes(lowerKeyword) ||
            ex.name.toLowerCase().includes(lowerKeyword)
        );
    }
    
    if (filters) {
        if (filters.area && filters.area !== "all") {
            exercises = exercises.filter(ex => ex.area === filters.area);
        }
        if (filters.equipment && filters.equipment !== "all") {
            exercises = exercises.filter(ex => {
                let equipLower = ex.equipment.toLowerCase();
                return equipLower.includes(filters.equipment) || 
                       (filters.equipment === "bodyweight" && ex.equipment === "自重") ||
                       (filters.equipment === "barbell" && ex.equipment.includes("杠铃")) ||
                       (filters.equipment === "dumbbell" && ex.equipment.includes("哑铃")) ||
                       (filters.equipment === "machine" && ex.equipment.includes("机")) ||
                       (filters.equipment === "cable" && ex.equipment.includes("龙门架")) ||
                       (filters.equipment === "band" && ex.equipment.includes("弹力"));
            });
        }
        if (filters.pattern && filters.pattern !== "all") {
            exercises = exercises.filter(ex => ex.pattern === filters.pattern);
        }
        if (filters.type && filters.type !== "all") {
            exercises = exercises.filter(ex => ex.type === filters.type);
        }
    }
    
    return exercises;
}

// ==================== 每周训练计划提醒 ====================

function getUpcomingTrainingDays(daysAhead = 7) {
    let upcoming = [];
    let today = new Date();
    for (let i = 0; i <= daysAhead; i++) {
        let checkDate = new Date(today);
        checkDate.setDate(today.getDate() + i);
        let dateStr = checkDate.toISOString().slice(0, 10);
        let events = getScheduleEventsByDate(dateStr);
        for (let event of events) {
            upcoming.push({
                date: dateStr,
                dateDisplay: `${checkDate.getMonth()+1}/${checkDate.getDate()}`,
                dayName: getDayNameShort(checkDate.getDay()),
                event: event
            });
        }
    }
    return upcoming;
}

function getDayNameShort(dayIndex) {
    const names = {0: "周日", 1: "周一", 2: "周二", 3: "周三", 4: "周四", 5: "周五", 6: "周六"};
    return names[dayIndex] || "";
}

// ==================== 自定义计划 - 添加动作到某天 ====================
window.addExerciseToDay = function(weekIdx, dayIdx, exerciseName) {
    console.log("Adding exercise:", exerciseName, "to week", weekIdx, "day", dayIdx);
    // 确保 window.editingWeeks 存在
    if (typeof window.editingWeeks === 'undefined') {
        window.editingWeeks = [];
    }
    let weeks = window.editingWeeks;
    // 确保周存在
    if (!weeks[weekIdx]) {
        weeks[weekIdx] = { name: '', note: '', days: [] };
    }
    // 确保天存在
    if (!weeks[weekIdx].days) {
        weeks[weekIdx].days = [];
    }
    if (!weeks[weekIdx].days[dayIdx]) {
        weeks[weekIdx].days[dayIdx] = { name: '', note: '', exercises: [], dayOfWeek: dayIdx };
    }
    if (!weeks[weekIdx].days[dayIdx].exercises) {
        weeks[weekIdx].days[dayIdx].exercises = [];
    }
    // 查找动作详情
    let exerciseData = null;
    for (let muscle of MUSCLES_SIMPLE) {
        let plans = WORKOUT_PLANS[muscle] || [];
        let found = plans.find(e => e.name === exerciseName);
        if (found) {
            exerciseData = {
                name: found.name,
                sets: found.sets || 4,
                reps: found.reps || 10,
                weight: 20,
                rest: found.rest || 60,
                caloriesPerSet: found.caloriesPerSet || 5
            };
            break;
        }
    }
    if (exerciseData) {
        weeks[weekIdx].days[dayIdx].exercises.push(exerciseData);
        window.editingWeeks = weeks;
        console.log("Exercise added, now weeks:", JSON.stringify(weeks));
        // 刷新编辑器显示
        if (typeof refreshWeeksEditor === 'function') {
            refreshWeeksEditor();
        } else {
            console.log("refreshWeeksEditor not available, trying to update DOM directly");
            // 直接更新显示
            let container = document.getElementById('weeksContainer');
            if (container && typeof renderWeeksEditor === 'function') {
                container.innerHTML = renderWeeksEditor(window.editingWeeks);
                if (typeof bindWeekInputs === 'function') bindWeekInputs();
            }
        }
    } else {
        console.log("Exercise not found:", exerciseName);
        alert('未找到动作: ' + exerciseName);
    }
};

// ==================== 更新计划训练进度 ====================
// 获取计划中所有训练日的完成情况
function getProgramProgress(programId) {
    let program = getCustomProgram(programId);
    if (!program) return { total: 0, completed: 0, percent: 0 };
    let totalDays = 0;
    let completedDays = 0;
    
    // 计算总训练日数
    for (let week of program.weeks) {
        totalDays += week.days.length;
    }
    
    // 检查每个训练日是否已完成
    for (let weekIdx = 0; weekIdx < program.weeks.length; weekIdx++) {
        let week = program.weeks[weekIdx];
        for (let dayIdx = 0; dayIdx < week.days.length; dayIdx++) {
            let day = week.days[dayIdx];
            let eventId = `${program.id}_w${weekIdx}_d${dayIdx}`;
            // 检查训练记录中是否有该天的完成记录
            let isCompleted = checkTrainingDayCompleted(programId, weekIdx, dayIdx);
            if (isCompleted) {
                completedDays++;
            }
        }
    }
    
    let percent = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
    return { total: totalDays, completed: completedDays, percent: percent };
}

// 检查某个训练日是否已完成
function checkTrainingDayCompleted(programId, weekIdx, dayIdx) {
    let eventId = `${programId}_w${weekIdx}_d${dayIdx}`;
    let completedKey = `program_completed_${eventId}`;
    return localStorage.getItem(completedKey) === 'true';
}

// 标记训练日为已完成
function markTrainingDayCompleted(programId, weekIdx, dayIdx) {
    let eventId = `${programId}_w${weekIdx}_d${dayIdx}`;
    let completedKey = `program_completed_${eventId}`;
    localStorage.setItem(completedKey, 'true');
    
    // 检查计划是否全部完成
    let progress = getProgramProgress(programId);
    if (progress.completed === progress.total && progress.total > 0) {
        // 全部完成，自动标记为已完成状态
        let program = getCustomProgram(programId);
        if (program && program.status !== 'completed') {
            program.status = 'completed';
            saveCustomProgram(program);
        }
    }
}
function updateProgramStatusByDate(programId) {
    let program = getCustomProgram(programId);
    if (!program) return;
    
    // 如果已经是已完成，不再更改
    if (program.status === 'completed') return;
    
    // 如果有开始日期且未开始，自动设置为进行中
    if (program.scheduleStartDate && program.status === 'not_started') {
        let startDate = new Date(program.scheduleStartDate);
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        if (startDate <= today) {
            program.status = 'active';
            saveCustomProgram(program);
        }
    }
}
