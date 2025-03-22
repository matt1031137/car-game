import { useBox, useRaycastVehicle } from "@react-three/cannon"
import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { BoxGeometry, MeshBasicMaterial, Quaternion } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useWheels } from "./useWheels";
import { WheelDebug } from "./WheelDebug";
import { useControls } from "./useControls";
import { Vector3 } from "three";
import { Euler } from "three";

export function Car({ thirdPerson }) {
    let mesh = useLoader(
        GLTFLoader,
        "./models/car.glb"
    ).scene;

    const position = [-1.5, 0.5, 3];
    const width = 0.15;
    const height = 0.07;
    const front = 0.15;
    const wheelRadius = 0.05;

    const chassisBodyArgs = [width, height, front * 2];
    const [chassisBody, chassisApi] = useBox(
        () => ({
            args: chassisBodyArgs,
            mass: 200,
            position,
        }),
        useRef(null),
    );

    const [wheels, wheelInfos] = useWheels(width, height, front, wheelRadius);


    const [vehicle, vehicleApi] = useRaycastVehicle(
        () => ({
            chassisBody,
            wheelInfos,
            wheels,
        }),
        useRef(null),
    );

    useControls(vehicleApi, chassisApi);


    useFrame((state) => {
        if (!thirdPerson) return;

        let position = new Vector3(0, 0, 0); //儲存車體的世界座標變換矩陣。
        position.setFromMatrixPosition(chassisBody.current.matrixWorld); //變換矩陣中提取出車體的世界座標（x, y, z）。

     // 取得 rotation（車體世界旋轉）
        let quaternion = new Quaternion(0, 0, 0, 0);
        quaternion.setFromRotationMatrix(chassisBody.current.matrixWorld);



        // 只保留 X & Y 軸旋轉，重設 Z 軸為 0
        let euler = new Euler();
        euler.setFromQuaternion(quaternion, 'YXZ'); 
        euler.z = 0; 
        let newQuaternion = new Quaternion().setFromEuler(euler);


        //將攝影機朝向-z軸，套入設定好的newQuaternion，
        let wDir = new Vector3(0, 0, -1);
        wDir.applyQuaternion(newQuaternion); //將此方向向量根據車體的旋轉四元數轉換，這樣 wDir 就變成「車體朝向的前方方向」。
        wDir.normalize(); //單位化向量，確保長度為 1。


        //計算攝影機應該放置的位置 將攝影機稍微往上抬(y軸0.3)wa
        let cameraPosition = position.clone().add(
            wDir.clone().multiplyScalar(-1).add(
                new Vector3(0, 0.3, 0)
            )
        );



        state.camera.position.copy(cameraPosition);
        state.camera.lookAt(position);

    });


    useEffect(() => {
        mesh.scale.set(0.0012, 0.0012, 0.0012);
        mesh.children[0].position.set(-365, -18, -67);
    })


    return (
        <group ref={vehicle} name="vehicle">
            <group ref={chassisBody} name="chassisBody">
                <primitive object={mesh} rotation-y={Math.PI} position={[0, -0.09, 0]} />
            </group>

            {/* <mesh ref={chassisBody}>
                <meshBasicMaterial transparent={true} opacity={0.3} />
                <boxGeometry args={chassisBodyArgs} />
            </mesh> */}

            <WheelDebug wheelRef={wheels[0]} radius={wheelRadius} />
            <WheelDebug wheelRef={wheels[1]} radius={wheelRadius} />
            <WheelDebug wheelRef={wheels[2]} radius={wheelRadius} />
            <WheelDebug wheelRef={wheels[3]} radius={wheelRadius} />
        </group>
    )






}

