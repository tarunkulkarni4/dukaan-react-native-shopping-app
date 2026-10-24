import React from "react";
import Svg, { Rect, Path, Circle, G, Text as SvgText } from "react-native-svg";

export default function DukaanLogo({ size = 220 }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 1024 1024">
            <Rect width="1024" height="1024" rx="224" fill="#0F3D2E" />

            <G>
                <Path d="M200 150 H304 V270 A52 52 0 0 1 200 270 Z" fill="#F2B01E" />
                <Path d="M304 150 H408 V270 A52 52 0 0 1 304 270 Z" fill="#F2F4F1" />
                <Path d="M408 150 H512 V270 A52 52 0 0 1 408 270 Z" fill="#F2B01E" />
                <Path d="M512 150 H616 V270 A52 52 0 0 1 512 270 Z" fill="#F2F4F1" />
                <Path d="M616 150 H720 V270 A52 52 0 0 1 616 270 Z" fill="#F2B01E" />
                <Path d="M720 150 H824 V270 A52 52 0 0 1 720 270 Z" fill="#F2F4F1" />
            </G>

            <Path d="M372 780 Q372 600 512 590 Q652 600 652 780 Z" fill="#F2F4F1" />
            <Path d="M486 596 L512 650 L538 596" fill="none" stroke="#C9D3CC" strokeWidth="8" />

            <Circle cx="436" cy="486" r="15" fill="#B87A4E" />
            <Circle cx="588" cy="486" r="15" fill="#B87A4E" />
            <Circle cx="512" cy="482" r="78" fill="#C68A5B" />

            <Path d="M428 470 Q418 360 512 350 Q606 360 596 470 Q512 428 428 470 Z" fill="#D9432F" />
            <Path d="M432 422 Q512 372 592 422" fill="none" stroke="#A8321F" strokeWidth="7" />
            <Path d="M428 448 Q512 398 596 448" fill="none" stroke="#A8321F" strokeWidth="7" />

            <Circle cx="486" cy="486" r="7" fill="#2B1B12" />
            <Circle cx="538" cy="486" r="7" fill="#2B1B12" />

            <Path d="M468 522 Q490 506 512 518 Q534 506 556 522 Q534 540 512 530 Q490 540 468 522 Z" fill="#2B1B12" />
            <Path d="M496 546 Q512 558 528 546" fill="none" stroke="#2B1B12" strokeWidth="5" />

            <Rect x="220" y="700" width="584" height="130" rx="18" fill="#1F5A44" />
            <Rect x="220" y="700" width="584" height="22" rx="11" fill="#F2B01E" />

            <SvgText
                x="512"
                y="925"
                textAnchor="middle"
                fontSize="104"
                fontWeight="700"
                fill="#F2F4F1"
            >
                Dukaan
            </SvgText>
        </Svg>
    );
}