// ===== augment_definitions.js =====
// 실제 동작하는 증강들의 정의
// 각 증강은 이벤트 핸들러, modifier, 태그 등을 포함

// 증강 데이터 구조:
// {
//     id: "증강 ID",
//     name: "증강 이름",
//     rarity: "희귀도 (N, R, SR, SSR)",
//     description: "설명",
//     type: "패시브/액티브 타입 (passive, active)",
//     tags: ["태그1", "태그2"],
//     events: {
//         onJump: (player) => { /* 점프 시 실행 */ },
//         onHit: (player, ball) => { /* 공 칠 때 실행 */ },
//         onSmash: (player) => { /* 스매시 시 실행 */ },
//         onScore: (player) => { /* 득점 시 실행 */ },
//         onActivate: (player) => { /* 액티브 스킬 사용 시 */ }
//     },
//     modifiers: {
//         speed: 0.15,           // 이동속도 +15%
//         jumpPower: 0.25,       // 점프력 +25%
//         swingSpeed: 0.25,      // 스윙속도 +25%
//         hitboxSize: 0.15,      // 타격범위 +15%
//         damageReduction: 0.1   // 받는피해 -10%
//     },
//     cooldown: 15000           // 액티브 스킬 쿨타임 (ms)
// }

const AUGMENT_DEFINITIONS = {
    // ===== [기존 N 등급 증강 기능 구현 완성] =====
    
    "double_jump": {
        id: "double_jump",
        name: "더블 점프",
        rarity: "N",
        description: "공중에서 점프를 한 번 더 할 수 있습니다.",
        type: "passive",
        tags: ["기동"],
        events: {
            onJump: (player) => {
                // 점프 횟수 제어는 character.js 내부에서 ModifierManager의 jumpCount 스탯을 바라보므로
                // 별도의 이벤트 스크립트 없이 modifiers만으로 작동 가능합니다.
            }
        },
        modifiers: {
            jumpCount: 1 // 기본 1회에 +1회 추가 개념 (additive로 작동)
        }
    },

    "fast_walk": {
        id: "fast_walk",
        name: "가벼운 발걸음",
        rarity: "N",
        description: "이동 속도가 15% 증가합니다.",
        type: "passive",
        tags: ["기동"],
        events: {},
        modifiers: {
            speed: 0.15
        }
    },

    "wide_racket": {
        id: "wide_racket",
        name: "자석 라켓",
        rarity: "N",
        description: "라켓의 타격 범위가 15% 넓어집니다.",
        type: "passive",
        tags: ["공격"],
        events: {},
        modifiers: {
            hitboxSize: 0.15
        }
    },

    "strong_swing": {
        id: "strong_swing",
        name: "강력한 스윙",
        rarity: "N",
        description: "스매시 파워가 10% 증가합니다.",
        type: "passive",
        tags: ["공격"],
        events: {},
        modifiers: {
            smashPower: 0.10
        }
    },

    "quick_reflex": {
        id: "quick_reflex",
        name: "빠른 반응",
        rarity: "N",
        description: "스윙 후 딜레이가 15% 감소합니다.",
        type: "passive",
        tags: ["공격"],
        events: {},
        modifiers: {
            swingDelay: -0.15
        }
    },

    "iron_skin": {
        id: "iron_skin",
        name: "철갑 피부",
        rarity: "N",
        description: "받는 피해가 10% 감소합니다.",
        type: "passive",
        tags: ["방어"],
        events: {},
        modifiers: {
            // game.js의 triggerDamageVisuals 연산 시 반영
            damageReduction: -0.10 
        }
    },

    "high_jump": {
        id: "high_jump",
        name: "높은 점프",
        rarity: "N",
        description: "점프 높이가 20% 증가합니다.",
        type: "passive",
        tags: ["기동"],
        events: {},
        modifiers: {
            jumpHeight: 0.20
        }
    },

    "precise_hit": {
        id: "precise_hit",
        name: "정확한 타격",
        rarity: "N",
        description: "스윗 스팟 범위가 20% 넓어집니다.",
        type: "passive",
        tags: ["공격"],
        events: {},
        modifiers: {
            sweetSpotSize: 0.20
        }
    },

    "stamina_boost": {
        id: "stamina_boost",
        name: "체력 증진",
        rarity: "N",
        description: "최대 체력이 20 증가합니다.",
        type: "passive",
        tags: ["방어"],
        events: {
            onAugmentPick: (playerSide) => {
                if (typeof game === 'undefined') return;
                const hpIncrease = 20;
                game.maxHp[playerSide] += hpIncrease;
                game.hp[playerSide] += hpIncrease;
                if (networkRole === 'host' && typeof game.broadcastHpSync === 'function') {
                    game.broadcastHpSync(false);
                }
            }
        },
        modifiers: {}
    },

    "fast_serve": {
        id: "fast_serve",
        name: "빠른 서브",
        rarity: "N",
        description: "서브 속도가 10% 증가합니다.",
        type: "passive",
        tags: ["공격"],
        events: {},
        modifiers: {
            serveSpeed: 0.10
        }
    },

    // ===== [신규 N 등급 증강 리스트 추가] =====

    "focus_mind": {
        id: "focus_mind",
        name: "집중",
        rarity: "N",
        description: "액티브 스킬(스페이스바)의 쿨타임이 10% 감소합니다.",
        type: "passive",
        tags: ["제어"],
        events: {},
        modifiers: {
            cooldownReduction: 0.10 // 쿨타임 10% 감소 보정치
        }
    },

    "warming_up": {
        id: "warming_up",
        name: "예열",
        rarity: "N",
        description: "랠리가 길어질수록 공속이 증가합니다. (3번째 타격부터 매 타격당 공 속도 +3%)",
        type: "passive",
        tags: ["공격"],
        events: {},
        modifiers: {}
    },

    "vampirism": {
        id: "vampirism",
        name: "흡혈",
        rarity: "N",
        description: "득점 시 체력을 4 회복합니다.",
        type: "passive",
        tags: ["방어"],
        events: {
            onScore: (scorerSide) => {
                if (typeof game === 'undefined') return;
                const scorer = (scorerSide === 'p1') ? game.p1 : game.p2;
                let prevHp = game.hp[scorerSide];
                game.hp[scorerSide] = Math.min(game.maxHp[scorerSide], game.hp[scorerSide] + 4);
                let healedAmount = game.hp[scorerSide] - prevHp;

                if (healedAmount > 0) {
                    game.texts.push(new FloatingText(scorer.x, scorer.y - 40, `+${healedAmount} HP 회복`, "#2ecc71", 35));
                }
            }
        },
        modifiers: {}
    },

    "air_balance": {
        id: "air_balance",
        name: "균형감각",
        rarity: "N",
        description: "공중에서의 이동속도가 25% 증가합니다.",
        type: "passive",
        tags: ["기동"],
        events: {},
        modifiers: {
            airSpeed: 0.25 // 공중 전용 속도 보정 스탯
        }
    },

    // ===== R 등급 증강 =====

    "gangster": {
        id: "gangster",
        name: "갱스터",
        rarity: "R",
        description: "무장한 갱스터가 나타나 상대에게 총알 6발을 발사합니다. 맞으면 체력 1 감소, 0.3초 스턴. 현재 액티브 스킬이 해당 스킬로 교체됩니다.",
        type: "active",
        tags: ["공격"],
        events: {
            onActivate: (player) => {
                console.log("갱스터 발동");
                // 갱스터 스킬 발동 로직
                if (typeof game !== 'undefined') {
                    // 내 화면쪽 기준 갱스터 스폰 위치 계산
                    const spawnX = (player.dir === -1) ? 100 : CW - 100;
                    const spawnY = FLOOR_Y - 100;
                    
                    // 갱스터 스폰
                    game.gangster = {
                        x: spawnX,
                        y: spawnY,
                        active: true,
                        bullets: [],
                        bulletCount: 0,
                        maxBullets: 6,
                        shooter: player,
                        fireInterval: null
                    };
                    
                    // 총알 발사 시작 (랜덤 난사 6발)
                    let bulletIndex = 0;
                    const fireBullet = () => {
                        if (bulletIndex >= 6) {
                            clearInterval(game.gangster.fireInterval);
                            game.gangster.active = false;
                            return;
                        }

                        // 총알 발사 소리
                        if (typeof SoundEngine !== 'undefined' && SoundEngine.playGunshotSound) {
                            SoundEngine.playGunshotSound();
                        }

                        // 상대방 방향으로 랜덤 각도로 총알 발사
                        const targetX = (player.dir === -1) ? CW : 0;
                        const dx = targetX - spawnX;
                        const dy = 0;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const speed = 20;

                        // 랜덤 각도 (-30도 ~ +30도)
                        const randomAngle = (Math.random() - 0.5) * Math.PI / 3;
                        const baseAngle = Math.atan2(dy, dx);
                        const finalAngle = baseAngle + randomAngle;

                        game.gangster.bullets.push({
                            x: spawnX,
                            y: spawnY,
                            vx: Math.cos(finalAngle) * speed,
                            vy: Math.sin(finalAngle) * speed,
                            active: true,
                            owner: player // 총알 소유자 표시
                        });

                        bulletIndex++;
                    };
                    
                    // 첫 발 즉시 발사, 이후 0.2초 간격
                    fireBullet();
                    game.gangster.fireInterval = setInterval(fireBullet, 200);
                    
                    // 이펙트
                    game.texts.push(new FloatingText(spawnX, spawnY - 50, "갱스터 등장!", "#ff4444", 40));
                    
                    // 동기화
                    if (typeof broadcastData === 'function') {
                        broadcastData('gangster_spawn', {
                            x: spawnX,
                            y: spawnY,
                            shooterSide: (player.dir === -1) ? 'p1' : 'p2'
                        });
                    }
                }
            }
        },
        cooldown: 15000
    },

    // ===== SR 등급 증강 =====

    "silver_arrow": {
        id: "silver_arrow",
        name: "은화살",
        rarity: "SR",
        description: "스매시를 3회 연속 사용하면, 세 번째 스매시가 '파워샷'으로 강화됩니다. 매 세 번째 스매시마다 강화됩니다. 파워샷 속도 +30%, 득점 시 피해 +30%.",
        type: "passive",
        tags: ["공격"],
        setEffect: null,
        events: {
            onSmash: (player) => {
                if (typeof game === 'undefined') return;
                player.smashStreak++;
                if (player.smashStreak % 3 === 0) {
                    game.birdie.isPowerShot = true;
                    game.texts.push(new FloatingText(player.x, player.y - 60, "!", "#c0c0c0", 50));
                    // 파워샷 쇳소리
                    if (typeof SoundEngine !== 'undefined' && SoundEngine.playMetalClashSound) {
                        SoundEngine.playMetalClashSound();
                    }
                }
            },
            onScore: (scorerSide) => {
                if (typeof game === 'undefined') return;
                const scorer = (scorerSide === 'p1') ? game.p1 : game.p2;
                scorer.smashStreak = 0;
            },
            onRallyEnd: () => {
                if (typeof game === 'undefined') return;
                game.p1.smashStreak = 0;
                game.p2.smashStreak = 0;
            }
        },
        modifiers: {
            smashSpeed: 0.3,
            powerShotDamage: 0.3
        }
    },

    "smash_cancel": {
        id: "smash_cancel",
        name: "스매시 캔슬",
        rarity: "SR",
        description: "스매시 공격 도중 스페이스바를 입력하면 드롭샷으로 즉시 전환합니다. 상대의 타이밍을 무너뜨리는 심리전 특화 증강입니다.",
        type: "passive",
        tags: ["기동"],
        setEffect: {
            id: "cancel",
            name: "캔슬",
            maxCount: 2,
            description: "캔슬 드롭샷의 속도가 40% 증가합니다.",
            effect: { cancelDropSpeed: 0.4 }
        },
        events: {
            onSmash: (player) => {
                player.canCancel = true;
            }
        },
        modifiers: {}
    },

    "drive_cancel": {
        id: "drive_cancel",
        name: "드라이브 캔슬",
        rarity: "SR",
        description: "드라이브 공격 도중 스페이스바를 입력하면 드롭샷으로 즉시 전환합니다. 빠른 템포 속에서 상대의 예측을 흔듭니다.",
        type: "passive",
        tags: ["기동"],
        setEffect: {
            id: "cancel",
            name: "캔슬",
            maxCount: 2,
            description: "캔슬 드롭샷의 속도가 40% 증가합니다.",
            effect: { cancelDropSpeed: 0.4 }
        },
        events: {
            onDrive: (player) => {
                player.canCancel = true;
            }
        },
        modifiers: {}
    },

    "mouse_trap": {
        id: "mouse_trap",
        name: "쥐덫",
        rarity: "SR",
        description: "득점에 성공하면 셔틀콕이 떨어진 위치에 쥐덫을 설치합니다. 다음 득점(양쪽 모두)이 나올 때까지 유지되며, 밟으면 덫이 사라지고 그 플레이어의 이동속도가 1초 동안 44% 감소합니다.",
        type: "passive",
        tags: ["방어"],
        setEffect: null,
        events: {
            onScore: (scorerSide) => {
                if (typeof game === 'undefined') return;
                const trapX = game.birdie.x;
                const trapY = game.birdie.y;
                game.mouseTrap = {
                    x: trapX,
                    y: trapY,
                    active: true
                };
                if (typeof SoundEngine !== 'undefined' && SoundEngine.playTrapSetSound) {
                    SoundEngine.playTrapSetSound();
                }
                if ((networkRole === 'host' || isLocalSinglePlayer) && typeof broadcastData === 'function') {
                    broadcastData('mouse_trap_spawn', { x: trapX, y: trapY });
                }
            }
        },
        modifiers: {}
    },

    "net_up": {
        id: "net_up",
        name: "네트 업",
        rarity: "SR",
        description: "사용 시 추가 네트를 생성합니다. 4초 동안 반투명한 보조 네트가 생성되며, 상대의 셔틀콕만 막습니다. 현재 액티브 스킬이 해당 스킬로 교체됩니다.",
        type: "active",
        tags: ["방어"],
        setEffect: null,
        events: {
            onActivate: (player) => {
                if (typeof game === 'undefined') return;
                game.auxiliaryNet = {
                    active: true,
                    timer: 240, // 4초 (60fps * 4)
                    shooter: player
                };
                game.texts.push(new FloatingText(NET_X, FLOOR_Y - 150, "네트 업!", "#3498db", 40));

                // 네트업 설치 소리
                if (typeof SoundEngine !== 'undefined' && SoundEngine.playNetUpSound) {
                    SoundEngine.playNetUpSound();
                }

                // 동기화
                if (typeof broadcastData === 'function') {
                    broadcastData('net_up_activate', {
                        shooterSide: (player.dir === -1) ? 'p1' : 'p2'
                    });
                }
            }
        },
        cooldown: 15000
    },

    "mirror_shield": {
        id: "mirror_shield",
        name: "반사 장벽",
        rarity: "SR",
        description: "네트 근처에 감속 장벽을 생성합니다. 현재 액티브 스킬이 해당 스킬로 교체됩니다.",
        type: "active",
        tags: ["방어"],
        events: {
            onActivate: (player) => {
                console.log("반사 장벽 발동");
                // SpawnManager를 통해 장벽 생성
                if (typeof SpawnManager !== 'undefined') {
                    SpawnManager.spawn('shield', NET_X, FLOOR_Y - 50);
                }
            }
        },
        cooldown: 20000
    },

    // ===== SSR 등급 증강 =====

    "judgment": {
        id: "judgment",
        name: "심판",
        rarity: "SSR",
        description: "공을 칠 수 있을 때 스페이스바를 누르면 공을 없애고 0.5초 후 상대 구역에 20 대미지의 거대한 성검을 떨어뜨립니다. 현재 액티브 스킬이 해당 스킬로 교체됩니다.",
        type: "active",
        tags: ["공격"],
        events: {
            onActivate: (player) => {
                if (typeof game === 'undefined' || !game.birdie.active) return;

                // 내가 공을 칠 수 있는 범위에 있는지 검증
                let hitbox = player.getHitBox();
                let dist = getDistance(hitbox.x, hitbox.y, game.birdie.x, game.birdie.y);

                if (dist < hitbox.r + game.birdie.radius) {
                    console.log("⚔️ 성검의 심판 발동!");
                    
                    // 공을 일시적으로 비활성화 (화면에서 숨김)
                    game.birdie.active = false;
                    game.birdie.vx = 0;
                    game.birdie.vy = 0;

                    // 상대방 구역(넷 너머) 중 무작위 X 좌표 선정
                    let targetX;
                    if (player.dir === -1) {
                        // 내가 P1(왼쪽)이면 상대 구역은 오른쪽
                        targetX = rand(NET_X + 80, COURT_RIGHT - 80);
                    } else {
                        // 내가 P2(오른쪽)이면 상대 구역은 왼쪽
                        targetX = rand(COURT_LEFT + 80, NET_X - 80);
                    }

                    // 전역 게임 객체에 심판 스킬 상태 돌입 처리 (0.5초 타이머 세팅)
                    game.judgmentTimer = 30; // 60fps 기준 0.5초
                    game.judgmentX = targetX;
                    game.judgmentY = 50; // 하늘 위에서 시작
                    game.judgmentHitter = player;

                    // 이펙트 엔진 가동
                    if (typeof SoundEngine !== 'undefined') SoundEngine.playMegaAttemptSound();
                    game.texts.push(new FloatingText(game.judgmentX, CH / 2, "DEMACIA!!", "#ffea00", 50));

                    // 🌐 포톤을 통해 상대방에게도 심판 시전 알림 동기화 (패킷 전송)
                    broadcastData('hit_effect', {
                        x: game.birdie.x,
                        y: game.birdie.y,
                        hitText: "JUDGMENT!",
                        color: "#ffea00",
                        type: "judgment_start",
                        targetX: targetX,
                        shooterSide: (player.dir === -1) ? 'p1' : 'p2'
                    });
                } else {
                    // 공이 범위 내에 없으면 쿨타임을 돌려받음
                    if (typeof ActiveSkillManager !== 'undefined') {
                        ActiveSkillManager.lastUsedTime = 0;
                        game.myActiveCurrentCooldown = 0;
                    }
                }
            }
        },
        cooldown: 30000 // 최고 등급인 만큼 쿨타임 25초 세팅
    }
};

// 증강 정의에서 기본 정보만 추출하여 AUGMENT_DATABASE 형식으로 변환
function getAugmentDatabaseFromDefinitions() {
    const database = [];
    
    for (const key in AUGMENT_DEFINITIONS) {
        const aug = AUGMENT_DEFINITIONS[key];
        database.push({
            id: aug.id,
            name: aug.name,
            rarity: aug.rarity,
            description: aug.description
        });
    }
    
    return database;
}

// 증강 ID로 전체 정의 가져오기
function getAugmentDefinition(id) {
    return AUGMENT_DEFINITIONS[id] || null;
}
