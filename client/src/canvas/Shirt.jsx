import React from "react";
import { useSnapshot } from "valtio";
import state from "../store";
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
const Shirt = () => {
  const snap = useSnapshot(state);
  // useGLTF.preload("./shirt_baked.glb");
  const { nodes, materials } = useGLTF("./shirt_baked.glb");
  console.log(nodes, materials);
  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);
  useFrame((state, delta) => {
    easing.dampC(materials.lambert1.color, snap.color, 0.25, delta);
  });
  const stateString = JSON.stringify(snap);
  return (
    <group key={stateString}>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
      >
        {snap.isFullTexture && (
          <Decal
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
          ></Decal>
        )}
        {snap.isLogoTexture && (
          <Decal
            position={[0, 0.05, 0.1]}
            rotation={[0, 0, 0]}
            scale={0.12}
            map={logoTexture}
            depthTest={false}
            depthWrite={true}
          ></Decal>
        )}
      </mesh>
    </group>
  );
};

export default Shirt;
