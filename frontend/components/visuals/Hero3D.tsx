'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';
import { Environment } from '@react-three/drei';

const MetallicShape = ({ position, rotationSpeed, scale, geometryType }: any) => {
    const meshRef = useRef<Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.getElapsedTime();
        // Mechanical, slow rotation. No floating/bouncing.
        meshRef.current.rotation.y = time * rotationSpeed;
        meshRef.current.rotation.x = Math.PI / 6 + (time * rotationSpeed * 0.2); // Fixed tilt + slow roll
    });

    const materialProps = {
        color: "#1a1a1a", // Darker base for Gunmetal/Dark Chrome look (reduces overall brightness)
        metalness: 1.0,   // Full metallic
        roughness: 0.05,  // Very smooth for sharp reflections
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        envMapIntensity: 2.0, // High contrast reflections
    };

    return (
        <mesh ref={meshRef} position={position} scale={scale}>
            {geometryType === 'cube' && <boxGeometry args={[1.5, 1.5, 1.5]} />}
            {geometryType === 'tetrahedron' && <tetrahedronGeometry args={[1.5, 0]} />}
            {geometryType === 'bar' && <boxGeometry args={[0.5, 3, 0.5]} />}

            <meshPhysicalMaterial {...materialProps} />
        </mesh>
    );
};

export const Hero3D = () => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 15], fov: 35 }} gl={{ antialias: true, alpha: true }}>

                {/* 
                   'Apartment' or 'City' presets work best for metal reflections. 
                   Using 'city' for high contrast urban reflections.
                */}
                <Environment preset="city" />

                {/* Reduced Lighting for moodier, reflective look */}
                <ambientLight intensity={0.2} />
                <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
                {/* Cool fill light - dimmed */}
                <pointLight position={[-10, 0, -5]} intensity={1} color="#6366f1" distance={20} />

                <group>
                    {/* Top Right - Large Floating Cube */}
                    <MetallicShape
                        position={[6, 3, -1]}
                        scale={1.8}
                        rotationSpeed={0.1}
                        geometryType="cube"
                    />

                    {/* Bottom Left - Sharp Tetrahedron */}
                    <MetallicShape
                        position={[-6, -3, -3]}
                        scale={2.2}
                        rotationSpeed={0.08}
                        geometryType="tetrahedron"
                    />

                    {/* Deep Background - Vertical Bar/Monolith */}
                    <MetallicShape
                        position={[3, -4, -10]}
                        scale={1.5}
                        rotationSpeed={0.05}
                        geometryType="bar"
                    />
                </group>
            </Canvas>

            {/* Subtle vignette/glow to ground the scene */}
            <div className="absolute inset-0 z-[-1]">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gray-500/[0.05] rounded-full blur-[100px]" />
            </div>
        </div>
    );
};
