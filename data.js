// ==================== 肌肉列表 ====================
const MUSCLES_SIMPLE = [
    "胸部", "背部", "肩膀", "手臂(二头)", "手臂(三头)",
    "腹部", "大腿前侧", "大腿后侧", "臀部", "小腿"
];

// ==================== 每个部位6-8个动作 ====================
const WORKOUT_PLANS = {
    "胸部": [
        { name: "平板杠铃卧推", equipment: "杠铃+卧推凳", sets: 4, reps: "8-12次", rest: 60, caloriesPerSet: 8, instruction: "躺在平凳上，双手握杠铃略宽于肩，下放至胸部中段，发力推起", youtube: "https://www.youtube.com/results?search_query=%E5%8D%A7%E6%8E%A8+%E8%83%B8%E9%83%A8" },
        { name: "上斜哑铃卧推", equipment: "哑铃+上斜凳", sets: 4, reps: "8-12次", rest: 60, caloriesPerSet: 7, instruction: "上斜30-45度，哑铃从胸两侧推起，重点刺激上胸", youtube: "https://www.youtube.com/results?search_query=%E4%B8%8A%E6%96%9C%E5%8D%A7%E6%8E%A8" },
        { name: "蝴蝶机夹胸", equipment: "蝴蝶机", sets: 4, reps: "12-15次", rest: 45, caloriesPerSet: 6, instruction: "坐姿，手肘微曲，双手向中间夹，感受胸肌收缩", youtube: "https://www.youtube.com/results?search_query=%E8%9D%B4%E8%9D%B6%E6%9C%BA%E5%A4%B9%E8%83%B8" },
        { name: "双杠臂屈伸", equipment: "双杠", sets: 3, reps: "8-12次", rest: 60, caloriesPerSet: 7, instruction: "身体前倾，下放至肩部拉伸，胸肌发力推起", youtube: "https://www.youtube.com/results?search_query=%E5%8F%8C%E6%9D%A0%E8%87%82%E5%B1%88%E4%BC%B8" },
        { name: "器械推胸", equipment: "坐姿推胸机", sets: 4, reps: "10-12次", rest: 60, caloriesPerSet: 6, instruction: "坐姿，双手向前推，适合新手", youtube: "https://www.youtube.com/results?search_query=%E5%99%A8%E6%A2%B0%E6%8E%A8%E8%83%B8" },
        { name: "龙门架绳索夹胸", equipment: "龙门架", sets: 4, reps: "12-15次", rest: 45, caloriesPerSet: 6, instruction: "站姿，双手拉绳索向中间夹，练胸中缝", youtube: "https://www.youtube.com/results?search_query=%E9%BE%99%E9%97%A8%E6%9E%B6%E5%A4%B9%E8%83%B8" },
        { name: "下斜哑铃卧推", equipment: "哑铃+下斜凳", sets: 3, reps: "8-12次", rest: 60, caloriesPerSet: 7, instruction: "下斜姿势，刺激下胸", youtube: "https://www.youtube.com/results?search_query=%E4%B8%8B%E6%96%9C%E5%8D%A7%E6%8E%A8" },
        { name: "俯卧撑", equipment: "自重", sets: 3, reps: "力竭", rest: 45, caloriesPerSet: 5, instruction: "随时随地可做，宽距刺激胸肌外侧", youtube: "https://www.youtube.com/results?search_query=%E4%BF%AF%E5%8D%A7%E6%92%91+%E8%83%B8%E9%83%A8" }
    ],
    "背部": [
        { name: "引体向上", equipment: "单杠", sets: 4, reps: "力竭", rest: 90, caloriesPerSet: 8, instruction: "正手宽握，用背阔肌力量上拉至下巴过杠", youtube: "https://www.youtube.com/results?search_query=%E5%BC%95%E4%BD%93%E5%90%91%E4%B8%8A" },
        { name: "高位下拉", equipment: "高位下拉机", sets: 4, reps: "10-12次", rest: 60, caloriesPerSet: 7, instruction: "坐姿，宽握下拉至锁骨，收缩肩胛", youtube: "https://www.youtube.com/results?search_query=%E9%AB%98%E4%BD%8D%E4%B8%8B%E6%8B%89" },
        { name: "坐姿划船", equipment: "坐姿划船机", sets: 4, reps: "10-12次", rest: 60, caloriesPerSet: 7, instruction: "坐姿，双手拉至腹部，夹紧背部", youtube: "https://www.youtube.com/results?search_query=%E5%9D%90%E5%A7%BF%E5%88%92%E8%88%B9" },
        { name: "杠铃划船", equipment: "杠铃", sets: 4, reps: "8-12次", rest: 75, caloriesPerSet: 8, instruction: "俯身约45度，杠铃沿大腿拉向腹部", youtube: "https://www.youtube.com/results?search_query=%E6%9D%A0%E9%93%83%E5%88%92%E8%88%B9" },
        { name: "单臂哑铃划船", equipment: "哑铃+平凳", sets: 4, reps: "10-12次/侧", rest: 60, caloriesPerSet: 7, instruction: "单手撑凳，另一只手划船，动作幅度大", youtube: "https://www.youtube.com/results?search_query=%E5%8D%95%E8%87%82%E5%93%91%E9%93%83%E5%88%92%E8%88%B9" },
        { name: "T杠划船", equipment: "T杠", sets: 4, reps: "8-12次", rest: 75, caloriesPerSet: 8, instruction: "站姿，双手握T杠，拉向腹部", youtube: "https://www.youtube.com/results?search_query=T%E6%9D%A0%E5%88%92%E8%88%B9" },
        { name: "直臂下压", equipment: "龙门架", sets: 3, reps: "12-15次", rest: 45, caloriesPerSet: 6, instruction: "直臂压杆，孤立刺激背阔肌", youtube: "https://www.youtube.com/results?search_query=%E7%9B%B4%E8%87%82%E4%B8%8B%E5%8E%8B" },
        { name: "器械划船", equipment: "坐姿划船机", sets: 3, reps: "10-12次", rest: 60, caloriesPerSet: 6, instruction: "固定器械，适合新手", youtube: "https://www.youtube.com/results?search_query=%E5%99%A8%E6%A2%B0%E5%88%92%E8%88%B9" }
    ],
    "肩膀": [
        { name: "坐姿哑铃推举", equipment: "哑铃+直角凳", sets: 4, reps: "8-12次", rest: 60, caloriesPerSet: 7, instruction: "坐姿，哑铃从肩推至头顶，练整个肩膀", youtube: "https://www.youtube.com/results?search_query=%E5%9D%90%E5%A7%BF%E5%93%91%E9%93%83%E6%8E%A8%E4%B8%BE" },
        { name: "杠铃推举", equipment: "杠铃", sets: 4, reps: "8-12次", rest: 60, caloriesPerSet: 8, instruction: "站姿或坐姿，杠铃从锁骨推至头顶", youtube: "https://www.youtube.com/results?search_query=%E6%9D%A0%E9%93%83%E6%8E%A8%E4%B8%BE" },
        { name: "哑铃侧平举", equipment: "哑铃", sets: 4, reps: "12-15次", rest: 45, caloriesPerSet: 5, instruction: "微曲肘，哑铃向两侧抬高至肩膀高度", youtube: "https://www.youtube.com/results?search_query=%E5%93%91%E9%93%83%E4%BE%A7%E5%B9%B3%E4%B8%BE" },
        { name: "哑铃前平举", equipment: "哑铃", sets: 3, reps: "12-15次", rest: 45, caloriesPerSet: 5, instruction: "直臂向前抬起，练肩膀前束", youtube: "https://www.youtube.com/results?search_query=%E5%93%91%E9%93%83%E5%89%8D%E5%B9%B3%E4%B8%BE" },
        { name: "俯身飞鸟", equipment: "哑铃", sets: 4, reps: "12-15次", rest: 45, caloriesPerSet: 5, instruction: "俯身，哑铃向两侧抬起，练肩膀后束", youtube: "https://www.youtube.com/results?search_query=%E4%BF%AF%E8%BA%AB%E9%A3%9E%E9%B8%9F" },
        { name: "蝴蝶机反向飞鸟", equipment: "蝴蝶机", sets: 4, reps: "12-15次", rest: 45, caloriesPerSet: 5, instruction: "反向坐，双手向后打开，练肩膀后束", youtube: "https://www.youtube.com/results?search_query=%E8%9D%B4%E8%9D%B6%E6%9C%BA%E5%8F%8D%E5%90%91%E9%A3%9E%E9%B8%9F" },
        { name: "面拉", equipment: "龙门架+绳索", sets: 4, reps: "12-15次", rest: 45, caloriesPerSet: 5, instruction: "绳索拉向额头，外旋肩关节，练后束和肩袖", youtube: "https://www.youtube.com/results?search_query=%E9%9D%A2%E6%8B%89+%E8%82%A9%E9%83%A8" },
        { name: "史密斯机推举", equipment: "史密斯机", sets: 3, reps: "8-12次", rest: 60, caloriesPerSet: 6, instruction: "史密斯机推举，轨迹固定更安全", youtube: "https://www.youtube.com/results?search_query=%E5%8F%B2%E5%AF%86%E6%96%AF%E6%9C%BA%E6%8E%A8%E4%B8%BE" }
    ],
    "手臂(二头)": [
        { name: "杠铃弯举", equipment: "杠铃", sets: 4, reps: "8-12次", rest: 60, caloriesPerSet: 5, instruction: "站姿，大臂夹紧，弯举杠铃至肩前", youtube: "https://www.youtube.com/results?search_query=%E6%9D%A0%E9%93%83%E5%BC%AF%E4%B8%BE" },
        { name: "哑铃交替弯举", equipment: "哑铃", sets: 4, reps: "10-12次/侧", rest: 45, caloriesPerSet: 5, instruction: "左右交替弯举，可以更专注", youtube: "https://www.youtube.com/results?search_query=%E5%93%91%E9%93%83%E4%BA%A4%E6%9B%BF%E5%BC%AF%E4%B8%BE" },
        { name: "牧师凳弯举", equipment: "牧师凳+杠铃/哑铃", sets: 3, reps: "10-12次", rest: 45, caloriesPerSet: 4, instruction: "手臂架在斜板上，孤立二头", youtube: "https://www.youtube.com/results?search_query=%E7%89%A7%E5%B8%88%E5%87%B3%E5%BC%AF%E4%B8%BE" },
        { name: "绳索弯举", equipment: "龙门架+绳索", sets: 4, reps: "10-12次", rest: 45, caloriesPerSet: 5, instruction: "站姿，绳索弯举，全程保持张力", youtube: "https://www.youtube.com/results?search_query=%E7%BB%B3%E7%B4%A2%E5%BC%AF%E4%B8%BE" },
        { name: "锤式弯举", equipment: "哑铃", sets: 3, reps: "10-12次", rest: 45, caloriesPerSet: 5, instruction: "手心相对弯举，同时练肱肌", youtube: "https://www.youtube.com/results?search_query=%E9%94%A4%E5%BC%8F%E5%BC%AF%E4%B8%BE" },
        { name: "集中弯举", equipment: "哑铃", sets: 3, reps: "12-15次/侧", rest: 30, caloriesPerSet: 4, instruction: "手肘靠大腿，单手弯举", youtube: "https://www.youtube.com/results?search_query=%E9%9B%86%E4%B8%AD%E5%BC%AF%E4%B8%BE" },
        { name: "反握引体向上", equipment: "单杠", sets: 3, reps: "8-12次", rest: 60, caloriesPerSet: 7, instruction: "反手握杠，更多刺激二头", youtube: "https://www.youtube.com/results?search_query=%E5%8F%8D%E6%8F%A1%E5%BC%95%E4%BD%93" }
    ],
    "手臂(三头)": [
        { name: "绳索下压", equipment: "龙门架+绳索", sets: 4, reps: "10-15次", rest: 45, caloriesPerSet: 5, instruction: "大臂垂直地面，下压绳索至手臂伸直", youtube: "https://www.youtube.com/results?search_query=%E7%BB%B3%E7%B4%A2%E4%B8%8B%E5%8E%8B" },
        { name: "窄距卧推", equipment: "杠铃+平凳", sets: 4, reps: "8-12次", rest: 60, caloriesPerSet: 7, instruction: "双手窄握，肘部贴近身体", youtube: "https://www.youtube.com/results?search_query=%E7%AA%84%E8%B7%9D%E5%8D%A7%E6%8E%A8" },
        { name: "过头臂屈伸", equipment: "哑铃", sets: 3, reps: "10-12次", rest: 45, caloriesPerSet: 5, instruction: "双手握哑铃过头，向下弯举", youtube: "https://www.youtube.com/results?search_query=%E8%BF%87%E5%A4%B4%E8%87%82%E5%B1%88%E4%BC%B8" },
        { name: "仰卧臂屈伸", equipment: "EZ杠+平凳", sets: 3, reps: "10-12次", rest: 45, caloriesPerSet: 5, instruction: "仰卧，杠铃从额头向后弯举", youtube: "https://www.youtube.com/results?search_query=%E4%BB%B0%E5%8D%A7%E8%87%82%E5%B1%88%E4%BC%B8" },
        { name: "双杠臂屈伸", equipment: "双杠", sets: 3, reps: "8-12次", rest: 60, caloriesPerSet: 6, instruction: "身体直立，重点刺激三头", youtube: "https://www.youtube.com/results?search_query=%E5%8F%8C%E6%9D%A0%E8%87%82%E5%B1%88%E4%BC%B8+%E4%B8%89%E5%A4%B4" },
        { name: "凳上反屈伸", equipment: "凳子", sets: 3, reps: "12-15次", rest: 45, caloriesPerSet: 4, instruction: "双手撑凳，身体下放，自重练三头", youtube: "https://www.youtube.com/results?search_query=%E5%87%B3%E4%B8%8A%E5%8F%8D%E5%B1%88%E4%BC%B8" },
        { name: "单臂绳索下压", equipment: "龙门架", sets: 3, reps: "12-15次/侧", rest: 30, caloriesPerSet: 4, instruction: "单侧训练，可以更专注", youtube: "https://www.youtube.com/results?search_query=%E5%8D%95%E8%87%82%E7%BB%B3%E7%B4%A2%E4%B8%8B%E5%8E%8B" }
    ],
    "腹部": [
        { name: "卷腹", equipment: "瑜伽垫", sets: 4, reps: "15-20次", rest: 30, caloriesPerSet: 3, instruction: "仰卧屈膝，卷起上背部，腹部收缩", youtube: "https://www.youtube.com/results?search_query=%E5%8D%B7%E8%85%B9+%E8%85%B9%E8%82%8C" },
        { name: "仰卧抬腿", equipment: "瑜伽垫", sets: 4, reps: "12-15次", rest: 30, caloriesPerSet: 3, instruction: "仰卧，双腿抬起至90度，练下腹", youtube: "https://www.youtube.com/results?search_query=%E4%BB%B0%E5%8D%A7%E6%8A%AC%E8%85%BF" },
        { name: "平板支撑", equipment: "瑜伽垫", sets: 3, reps: "30-60秒", rest: 30, caloriesPerSet: 4, instruction: "肘撑，身体成直线", youtube: "https://www.youtube.com/results?search_query=%E5%B9%B3%E6%9D%BF%E6%94%AF%E6%92%91" },
        { name: "悬垂举腿", equipment: "单杠", sets: 4, reps: "10-15次", rest: 45, caloriesPerSet: 5, instruction: "吊在单杠上，抬腿至90度", youtube: "https://www.youtube.com/results?search_query=%E6%82%AC%E5%9E%82%E4%B8%BE%E8%85%BF" },
        { name: "俄罗斯转体", equipment: "哑铃片/瑜伽垫", sets: 3, reps: "12-15次/侧", rest: 30, caloriesPerSet: 3, instruction: "坐姿，身体后仰，双手交替转向两侧", youtube: "https://www.youtube.com/results?search_query=%E4%BF%84%E7%BD%97%E6%96%AF%E8%BD%AC%E4%BD%93" },
        { name: "空中自行车", equipment: "瑜伽垫", sets: 3, reps: "20次/侧", rest: 30, caloriesPerSet: 4, instruction: "仰卧，脚蹬自行车，手肘碰对侧膝盖", youtube: "https://www.youtube.com/results?search_query=%E7%A9%BA%E4%B8%AD%E8%87%AA%E8%A1%8C%E8%BD%A6" },
        { name: "V字两头起", equipment: "瑜伽垫", sets: 3, reps: "10-15次", rest: 45, caloriesPerSet: 4, instruction: "手脚同时抬起，身体成V字", youtube: "https://www.youtube.com/results?search_query=V%E5%AD%97%E4%B8%A4%E5%A4%B4%E8%B5%B7" },
        { name: "绳索卷腹", equipment: "龙门架+绳索", sets: 3, reps: "12-15次", rest: 30, caloriesPerSet: 4, instruction: "跪姿，绳索下拉卷腹", youtube: "https://www.youtube.com/results?search_query=%E7%BB%B3%E7%B4%A2%E5%8D%B7%E8%85%B9" }
    ],
    "大腿前侧": [
        { name: "深蹲", equipment: "杠铃+深蹲架", sets: 4, reps: "8-12次", rest: 90, caloriesPerSet: 10, instruction: "杠铃后蹲，下蹲至大腿平行地面", youtube: "https://www.youtube.com/results?search_query=%E6%B7%B1%E8%B9%B2+%E5%A4%A7%E8%85%BF" },
        { name: "腿举", equipment: "腿举机", sets: 4, reps: "10-12次", rest: 75, caloriesPerSet: 8, instruction: "蹬腿举机，刺激整个大腿", youtube: "https://www.youtube.com/results?search_query=%E8%85%BF%E4%B8%BE" },
        { name: "保加利亚分腿蹲", equipment: "哑铃+凳子", sets: 3, reps: "10-12次/侧", rest: 60, caloriesPerSet: 8, instruction: "后脚垫高，前腿下蹲", youtube: "https://www.youtube.com/results?search_query=%E4%BF%9D%E5%8A%A0%E5%88%A9%E4%BA%9A%E5%88%86%E8%85%BF%E8%B9%B2" },
        { name: "腿伸展", equipment: "腿屈伸机", sets: 4, reps: "12-15次", rest: 45, caloriesPerSet: 6, instruction: "坐姿，小腿向上抬起，孤立股四头肌", youtube: "https://www.youtube.com/results?search_query=%E8%85%BF%E4%BC%B8%E5%B1%95" },
        { name: "前蹲", equipment: "杠铃", sets: 4, reps: "6-10次", rest: 90, caloriesPerSet: 9, instruction: "杠铃放前肩，更刺激股四头肌", youtube: "https://www.youtube.com/results?search_query=%E5%89%8D%E8%B9%B2" },
        { name: "箭步蹲", equipment: "哑铃", sets: 3, reps: "12-15次/侧", rest: 45, caloriesPerSet: 7, instruction: "前后弓箭步，下蹲至双膝90度", youtube: "https://www.youtube.com/results?search_query=%E7%AE%AD%E6%AD%A5%E8%B9%B2" },
        { name: "哈克深蹲", equipment: "哈克机", sets: 4, reps: "10-12次", rest: 75, caloriesPerSet: 8, instruction: "哈克机，固定轨迹深蹲", youtube: "https://www.youtube.com/results?search_query=%E5%93%88%E5%85%8B%E6%B7%B1%E8%B9%B2" },
        { name: "高脚杯深蹲", equipment: "哑铃", sets: 3, reps: "10-15次", rest: 60, caloriesPerSet: 7, instruction: "双手抱哑铃在胸前下蹲", youtube: "https://www.youtube.com/results?search_query=%E9%AB%98%E8%84%9A%E6%9D%AF%E6%B7%B1%E8%B9%B2" }
    ],
    "大腿后侧": [
        { name: "罗马尼亚硬拉", equipment: "杠铃", sets: 4, reps: "8-12次", rest: 75, caloriesPerSet: 9, instruction: "轻弯膝，髋向后推，感受大腿后侧拉伸", youtube: "https://www.youtube.com/results?search_query=%E7%BD%97%E9%A9%AC%E5%B0%BC%E4%BA%9A%E7%A1%AC%E6%8B%89" },
        { name: "腿弯举", equipment: "俯卧腿弯举机", sets: 4, reps: "10-12次", rest: 60, caloriesPerSet: 6, instruction: "俯卧，小腿向后弯举", youtube: "https://www.youtube.com/results?search_query=%E8%85%BF%E5%BC%AF%E4%B8%BE" },
        { name: "坐姿腿弯举", equipment: "坐姿腿弯举机", sets: 4, reps: "10-12次", rest: 60, caloriesPerSet: 6, instruction: "坐姿，小腿向后弯举", youtube: "https://www.youtube.com/results?search_query=%E5%9D%90%E5%A7%BF%E8%85%BF%E5%BC%AF%E4%B8%BE" },
        { name: "直腿硬拉", equipment: "哑铃/杠铃", sets: 3, reps: "10-12次", rest: 60, caloriesPerSet: 7, instruction: "膝盖微曲，直腿下放，拉伸腘绳肌", youtube: "https://www.youtube.com/results?search_query=%E7%9B%B4%E8%85%BF%E7%A1%AC%E6%8B%89" },
        { name: "北欧落腿", equipment: "瑜伽垫", sets: 3, reps: "6-10次", rest: 60, caloriesPerSet: 6, instruction: "膝盖跪地，身体缓慢下放，手撑住", youtube: "https://www.youtube.com/results?search_query=%E5%8C%97%E6%AC%A7%E8%90%BD%E8%85%BF" },
        { name: "壶铃摆荡", equipment: "壶铃", sets: 3, reps: "15-20次", rest: 45, caloriesPerSet: 8, instruction: "壶铃从胯下摆到胸前，髋部发力", youtube: "https://www.youtube.com/results?search_query=%E5%A3%B6%E9%93%83%E6%91%86%E8%8D%A1" }
    ],
    "臀部": [
        { name: "臀推", equipment: "杠铃+凳子", sets: 4, reps: "8-12次", rest: 75, caloriesPerSet: 8, instruction: "上背靠凳，杠铃放髋部，向上顶臀", youtube: "https://www.youtube.com/results?search_query=%E8%87%80%E6%8E%A8" },
        { name: "深蹲", equipment: "杠铃", sets: 4, reps: "8-12次", rest: 90, caloriesPerSet: 10, instruction: "深蹲同时刺激臀大肌", youtube: "https://www.youtube.com/results?search_query=%E6%B7%B1%E8%B9%B2+%E8%87%80" },
        { name: "臀桥", equipment: "瑜伽垫", sets: 4, reps: "12-15次", rest: 45, caloriesPerSet: 5, instruction: "仰卧屈膝，向上顶臀", youtube: "https://www.youtube.com/results?search_query=%E8%87%80%E6%A1%A5" },
        { name: "保加利亚分腿蹲", equipment: "哑铃", sets: 3, reps: "10-12次/侧", rest: 60, caloriesPerSet: 8, instruction: "单腿下蹲，重点练臀", youtube: "https://www.youtube.com/results?search_query=%E4%BF%9D%E5%8A%A0%E5%88%A9%E4%BA%9A%E5%88%86%E8%85%BF%E8%B9%B2+%E8%87%80" },
        { name: "罗马尼亚硬拉", equipment: "杠铃", sets: 4, reps: "8-12次", rest: 75, caloriesPerSet: 9, instruction: "髋主导，刺激臀和腘绳肌", youtube: "https://www.youtube.com/results?search_query=%E7%BD%97%E9%A9%AC%E5%B0%BC%E4%BA%9A%E7%A1%AC%E6%8B%89" },
        { name: "蚌式开合", equipment: "弹力带", sets: 3, reps: "15-20次/侧", rest: 30, caloriesPerSet: 3, instruction: "侧躺，膝盖开合，练臀中肌", youtube: "https://www.youtube.com/results?search_query=%E8%9A%8C%E5%BC%8F%E5%BC%80%E5%90%88" },
        { name: "绳索后抬腿", equipment: "龙门架", sets: 3, reps: "12-15次/侧", rest: 30, caloriesPerSet: 4, instruction: "站姿，绳索向后抬腿", youtube: "https://www.youtube.com/results?search_query=%E7%BB%B3%E7%B4%A2%E5%90%8E%E6%8A%AC%E8%85%BF" }
    ],
    "小腿": [
        { name: "站姿提踵", equipment: "站姿提踵机/台阶", sets: 4, reps: "15-20次", rest: 30, caloriesPerSet: 4, instruction: "前脚掌垫高，踮脚尖到最高点", youtube: "https://www.youtube.com/results?search_query=%E7%AB%99%E5%A7%BF%E6%8F%90%E8%B9%84" },
        { name: "坐姿提踵", equipment: "坐姿提踵机", sets: 4, reps: "15-20次", rest: 30, caloriesPerSet: 3, instruction: "坐姿，脚尖发力，练比目鱼肌", youtube: "https://www.youtube.com/results?search_query=%E5%9D%90%E5%A7%BF%E6%8F%90%E8%B9%84" },
        { name: "单腿站姿提踵", equipment: "台阶", sets: 3, reps: "12-15次/侧", rest: 30, caloriesPerSet: 4, instruction: "单腿做，增加强度", youtube: "https://www.youtube.com/results?search_query=%E5%8D%95%E8%85%BF%E6%8F%90%E8%B9%84" },
        { name: "驴式提踵", equipment: "提踵机/人辅助", sets: 3, reps: "15-20次", rest: 45, caloriesPerSet: 4, instruction: "俯身，重量压臀部，做提踵", youtube: "https://www.youtube.com/results?search_query=%E9%A9%B4%E5%BC%8F%E6%8F%90%E8%B9%84" },
        { name: "跳跃提踵", equipment: "自重", sets: 3, reps: "20次", rest: 30, caloriesPerSet: 5, instruction: "快速踮脚跳，增加爆发力", youtube: "https://www.youtube.com/results?search_query=%E8%B7%B3%E8%B7%83%E6%8F%90%E8%B9%84" },
        { name: "台阶提踵", equipment: "台阶", sets: 3, reps: "20次", rest: 30, caloriesPerSet: 4, instruction: "台阶边缘做，加大拉伸幅度", youtube: "https://www.youtube.com/results?search_query=%E5%8F%B0%E9%98%B6%E6%8F%90%E8%B9%84" }
    ]
};

// ==================== 食物热量蛋白质数据库 ====================
const FOOD_DATABASE = [
    { name: "鸡胸肉", baseAmount: 100, unit: "g", caloriesPerUnit: 165, proteinPerUnit: 31, type: "weight" },
    { name: "鸡蛋", baseAmount: 1, unit: "个", caloriesPerUnit: 70, proteinPerUnit: 6, type: "count" },
    { name: "牛肉", baseAmount: 100, unit: "g", caloriesPerUnit: 250, proteinPerUnit: 26, type: "weight" },
    { name: "三文鱼", baseAmount: 100, unit: "g", caloriesPerUnit: 208, proteinPerUnit: 20, type: "weight" },
    { name: "豆腐", baseAmount: 100, unit: "g", caloriesPerUnit: 76, proteinPerUnit: 8, type: "weight" },
    { name: "牛奶", baseAmount: 250, unit: "ml", caloriesPerUnit: 150, proteinPerUnit: 8, type: "volume" },
    { name: "希腊酸奶", baseAmount: 100, unit: "g", caloriesPerUnit: 59, proteinPerUnit: 10, type: "weight" },
    { name: "糙米", baseAmount: 100, unit: "g", caloriesPerUnit: 130, proteinPerUnit: 3, type: "weight" },
    { name: "藜麦", baseAmount: 100, unit: "g", caloriesPerUnit: 120, proteinPerUnit: 4, type: "weight" },
    { name: "燕麦", baseAmount: 50, unit: "g", caloriesPerUnit: 190, proteinPerUnit: 7, type: "weight" },
    { name: "红薯", baseAmount: 150, unit: "g", caloriesPerUnit: 130, proteinPerUnit: 2, type: "weight" },
    { name: "西兰花", baseAmount: 100, unit: "g", caloriesPerUnit: 34, proteinPerUnit: 3, type: "weight" },
    { name: "牛油果", baseAmount: 1, unit: "个", caloriesPerUnit: 240, proteinPerUnit: 3, type: "count" },
    { name: "香蕉", baseAmount: 1, unit: "根", caloriesPerUnit: 105, proteinPerUnit: 1, type: "count" },
    { name: "苹果", baseAmount: 1, unit: "个", caloriesPerUnit: 95, proteinPerUnit: 0.5, type: "count" },
    { name: "花生酱", baseAmount: 15, unit: "g", caloriesPerUnit: 90, proteinPerUnit: 4, type: "weight" },
    { name: "蛋白粉", baseAmount: 1, unit: "勺", caloriesPerUnit: 120, proteinPerUnit: 25, type: "count" },
    { name: "米饭", baseAmount: 150, unit: "g", caloriesPerUnit: 200, proteinPerUnit: 4, type: "weight" },
    { name: "面条", baseAmount: 150, unit: "g", caloriesPerUnit: 220, proteinPerUnit: 6, type: "weight" },
    { name: "全麦面包", baseAmount: 1, unit: "片", caloriesPerUnit: 80, proteinPerUnit: 4, type: "count" },
    { name: "鸡腿", baseAmount: 1, unit: "个", caloriesPerUnit: 130, proteinPerUnit: 18, type: "count" },
    { name: "猪肉", baseAmount: 100, unit: "g", caloriesPerUnit: 242, proteinPerUnit: 20, type: "weight" },
    { name: "虾仁", baseAmount: 100, unit: "g", caloriesPerUnit: 84, proteinPerUnit: 18, type: "weight" },
    { name: "豆腐干", baseAmount: 100, unit: "g", caloriesPerUnit: 150, proteinPerUnit: 16, type: "weight" },
    { name: "豆浆", baseAmount: 250, unit: "ml", caloriesPerUnit: 120, proteinPerUnit: 6, type: "volume" },
    { name: "橄榄油", baseAmount: 10, unit: "ml", caloriesPerUnit: 90, proteinPerUnit: 0, type: "volume" },
    { name: "花生油", baseAmount: 10, unit: "ml", caloriesPerUnit: 90, proteinPerUnit: 0, type: "volume" },
    { name: "黄油", baseAmount: 10, unit: "g", caloriesPerUnit: 72, proteinPerUnit: 0, type: "weight" },
    { name: "白砂糖", baseAmount: 5, unit: "g", caloriesPerUnit: 20, proteinPerUnit: 0, type: "weight" },
    { name: "盐", baseAmount: 1, unit: "g", caloriesPerUnit: 0, proteinPerUnit: 0, type: "weight" }
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

// ==================== 每月总结数据（健身人每月在意的内容） ====================
const MONTHLY_TIPS = {
    1: { title: "🏆 一月 · 新年新目标", content: "✅ 制定年度健身计划\n✅ 测量初始体重/体脂/围度\n✅ 设定3个月短期目标\n✅ 购买合适的运动装备\n💡 重点：养成训练习惯，不要急于求成" },
    2: { title: "❤️ 二月 · 心肺提升月", content: "✅ 增加有氧训练频率\n✅ 加入HIIT高强度间歇训练\n✅ 检查心率恢复速度\n✅ 注意心脏健康\n💡 重点：提升心肺功能为增肌打基础" },
    3: { title: "🌸 三月 · 增肌黄金期", content: "✅ 渐进式超负荷训练\n✅ 蛋白质摄入增加20%\n✅ 保证充足睡眠7-8小时\n✅ 记录训练重量变化\n💡 重点：力量突破，大重量低次数" },
    4: { title: "🌊 四月 · 核心强化月", content: "✅ 每周3次核心训练\n✅ 加入平板支撑变式\n✅ 训练深层腹肌\n✅ 改善体态问题\n💡 重点：强化腰腹力量，预防受伤" },
    5: { title: "💪 五月 · 力量突破月", content: "✅ 冲击1RM最大重量\n✅ 加入离心训练\n✅ 使用超级组技巧\n✅ 补充BCAA/蛋白粉\n💡 重点：突破平台期，提升力量" },
    6: { title: "☀️ 六月 · 夏季塑形月", content: "✅ 减脂和塑形并重\n✅ 加入循环训练\n✅ 控制碳水摄入\n✅ 增加水分摄入\n💡 重点：线条雕刻，露肉季节准备" },
    7: { title: "🏖️ 七月 · 减脂冲刺月", content: "✅ 制造热量缺口300-500\n✅ 增加有氧时长\n✅ 每周测量体脂\n✅ 避免高糖食物\n💡 重点：夏季海滩身材冲刺" },
    8: { title: "🥵 八月 · 耐力训练月", content: "✅ 增加训练容量\n✅ 进行肌肉耐力训练(15-20次)\n✅ 缩短组间休息\n✅ 多喝水防中暑\n💡 重点：提升肌肉耐力" },
    9: { title: "🍂 九月 · 新技术学习月", content: "✅ 学习新动作/技巧\n✅ 尝试不同分化训练\n✅ 请教他人或看教程\n✅ 记录动作细节\n💡 重点：多样化训练，避免无聊" },
    10: { title: "🎃 十月 · 体态调整月", content: "✅ 检查训练姿势\n✅ 加入拉伸和灵活性训练\n✅ 纠正圆肩驼背\n✅ 做体态评估\n💡 重点：动作质量大于重量" },
    11: { title: "🍁 十一月 · 挑战极限月", content: "✅ 打破个人记录\n✅ 进行力竭训练\n✅ 尝试新训练计划\n✅ 增加训练频率\n💡 重点：突破自我，挑战极限" },
    12: { title: "🎄 十二月 · 年度复盘月", content: "✅ 回顾全年进步\n✅ 测量年度变化数据\n✅ 总结成功和失败\n✅ 制定明年目标\n💡 重点：庆祝进步，规划未来" }
};

function getMonthlyTip(month) {
    return MONTHLY_TIPS[month] || MONTHLY_TIPS[1];
}
