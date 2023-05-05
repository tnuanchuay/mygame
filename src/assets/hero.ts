export interface ModelSet {
    StartSprite: string;
    Idle: string;
    Run?: string;
    Attack?: string
}

type HeroSetMap = { [key: string]: ModelSet }

export const HeroModel: HeroSetMap = {
    "hero_m" : {
        StartSprite: "hero_m_idle",
        Idle: "hero_m_idle",
    },
    "hero_fm": {
        StartSprite: "hero_fm_idle",
        Idle: "hero_fm_idle",
    }
}

export const getHeroModelSet = (modelId: string, ): ModelSet => {
    if(Object.keys(HeroModel).indexOf(modelId) >= 0){
        return HeroModel[modelId];
    }

    return HeroModel["hero_m"];
}