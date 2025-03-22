import { useEffect, useState, useRef } from "react";
import { Howl } from 'howler';

export const useControls = (vehicleApi, chassisApi) => {

    const soundRef = useRef(null);

    useEffect(() => {
        soundRef.current = new Howl({
            src: ['/se/engine.mp3'],
            loop: true,
            volume: 0.5,
            rate: 1.0,
        })

        soundRef.current.play();

        return () => {
            if (soundRef.current) soundRef.current.unload()
        }
    }, [])


    let [controls, setControls] = useState({
        // w: boolean,   
        // a: boolean,   
        // s: boolean,   
        // d: boolean,   

        // r: boolean,   
    });

    useEffect(() => {
        const keyDownPressHandler = (e) => {
            setControls((controls) => ({
                ...controls,
                [e.key.toLowerCase()]: true
            }));
        }

        const keyUpPressHandler = (e) => {
            setControls((controls) => ({
                ...controls,
                [e.key.toLowerCase()]: false
            }));
        }

        window.addEventListener("keydown", keyDownPressHandler);
        window.addEventListener("keyup", keyUpPressHandler);
        return () => {
            window.removeEventListener("keydown", keyDownPressHandler);
            window.removeEventListener("keyup", keyUpPressHandler);
        }
    }, []);

    useEffect(() => {
        if (controls.w) {
            vehicleApi.applyEngineForce(150, 2); // 讓後輪前進
            vehicleApi.applyEngineForce(200, 3);
            soundRef.current.rate(1 + 20 * 0.1);
        } else if (controls.s) {
            vehicleApi.applyEngineForce(-150, 2); // 讓後輪後退
            vehicleApi.applyEngineForce(-200, 3);
            soundRef.current.rate(1);
        } else {
            vehicleApi.applyEngineForce(0, 2); // 停止施加動力
            vehicleApi.applyEngineForce(0, 3);
            soundRef.current.rate(1);
        }

        if (controls.a) { //左轉
            vehicleApi.setSteeringValue(0.35, 2);  // 讓左後輪往左轉
            vehicleApi.setSteeringValue(0.35, 3);  // 讓右後輪往左轉
            vehicleApi.setSteeringValue(-0.1, 0);  // 讓左前輪微微往右 (防止過度轉向)
            vehicleApi.setSteeringValue(-0.1, 1);  // 讓右前輪微微往右
        } else if (controls.d) {
            vehicleApi.setSteeringValue(-0.35, 2);
            vehicleApi.setSteeringValue(-0.35, 3);
            vehicleApi.setSteeringValue(0.1, 0);
            vehicleApi.setSteeringValue(0.1, 1);
        } else {
            for (let i = 0; i < 4; i++) {
                vehicleApi.setSteeringValue(0, i);// 如果沒按方向鍵，讓四個輪胎回正
            }
        }


        if (controls.arrowdown) chassisApi.applyLocalImpulse([0, -5, 0], [0, 0, +1])
        if (controls.arrowup) chassisApi.applyLocalImpulse([0, -5, 0], [0, 0, -1])
        if (controls.arrowleft) chassisApi.applyLocalImpulse([0, -5, 0], [-0.5, 0, 0])
        if (controls.arrowright) chassisApi.applyLocalImpulse([0, -5, 0], [+0.5, 0, 0])

        if (controls.r) {
            chassisApi.position.set(-1.5, 0.5, 3);
            chassisApi.velocity.set(0, 0, 0);
            chassisApi.angularVelocity.set(0, 0, 0);
            chassisApi.rotation.set(0, 0, 0);
        }


    }, [controls, vehicleApi, chassisApi]);

    return controls;
}