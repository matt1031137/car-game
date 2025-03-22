import { useCompoundBody } from "@react-three/cannon";
import { useRef } from "react";

export const useWheels = (width, height, front, radius) => {
    const wheels = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const wheelInfo = {
        radius, //輪胎半徑
        directionLocal: [0, -1, 0], //懸吊方向 (向下)
        axleLocal: [1, 0, 0], //輪胎轉動軸向量 (左右)
        suspensionStiffness: 60,  //懸吊剛性 (值越大，懸吊越硬)
        suspensionRestLength: 0.1, //懸吊的靜態長度 (影響懸吊行程)
        frictionSlip: 5, //摩擦力 (影響輪胎抓地力)
        dampingRelaxation: 2.3, //懸吊回彈阻尼 (影響吸震)
        dampingCompression: 4.4, //懸吊壓縮阻尼 (影響懸吊被壓縮時的阻力)
        maxSuspensionForce: 100000, //最大懸吊力量 (影響車輛跳躍時的承受能力)
        rollInfluence: 0.01, //車輪對車體翻滾的影響 (越大翻滾越明顯)
        maxSuspensionTravel: 0.1, //懸吊最大行程
        customSlidingRotationalSpeed: -30, //自訂輪胎打滑時的旋轉速度
        useCustomSlidingRotationalSpeed: true, //是否使用 customSlidingRotationalSpeed
    };

    const wheelInfos = [
        {
            ...wheelInfo, //左前
            chassisConnectionPointLocal: [-width * 0.65, height * 0.4, front], //輪胎與車體的連接點座標
            isFrontWheel: true, //是否為前輪 (true = 前輪, false = 後輪)
        },
        {
            ...wheelInfo, //右前
            chassisConnectionPointLocal: [width * 0.65, height * 0.4, front],
            isFrontWheel: true,
        },
        {
            ...wheelInfo, //左後
            chassisConnectionPointLocal: [-width * 0.65, height * 0.4, -front],
            isFrontWheel: false,
        },
        {
            ...wheelInfo, //右後
            chassisConnectionPointLocal: [width * 0.65, height * 0.4, -front],
            isFrontWheel: false,
        },
    ];

    const propsFunc = () => ({
        collisionFilterGroup: 0, //不會與其他物件碰撞 (通常是因為輪胎是獨立於車體的)
        mass: 1, //質量 (在 Kinematic 模式下可能不影響)
        shapes: [ //輪胎的物理形狀
            {
                args: [wheelInfo.radius, wheelInfo.radius, 0.015, 16], //上半徑+下半徑+厚度+分段數(越高越圓滑)
                rotation: [0, 0, -Math.PI / 2], //讓圓柱橫放 (像輪胎)
                type: "Cylinder", //圓柱體
            },
        ],
        type: "Kinematic", //使輪胎是運動控制的 (不受物理力影響)
    });

    useCompoundBody(propsFunc, wheels[0]);
    useCompoundBody(propsFunc, wheels[1]);
    useCompoundBody(propsFunc, wheels[2]);
    useCompoundBody(propsFunc, wheels[3]);

    return [wheels, wheelInfos];
};