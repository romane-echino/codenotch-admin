export const Turquoise = '#1abc9c';
export const Emerald = '#2ecc71'
export const PeterRiver = '#3498db';
export const Amethyst = '#9b59b6';
export const WetAsphalt = '#34495e';
export const GreenSea = '#16a085';
export const Nephritis = '#27ae60';
export const BelizeHole = '#2980b9';
export const Wisteria = '#8e44ad';
export const MidnightBlue = '#2c3e50';
export const SunFlower = '#f1c40f';
export const Carrot = '#e67e22';
export const Alizarin = '#e74c3c';
export const Clouds = '#ecf0f1';
export const Concrete = '#95a5a6';
export const Orange = '#f39c12';
export const Pumpkin = '#d35400';
export const Pomegranate = '#c0392b';
export const Silver = '#bdc3c7';
export const Asbestos = '#7f8c8d';

export const DefaultColorPaletteNames = [
    'Turquoise',
    'Emerald',
    'PeterRiver',
    'Amethyst',
    'WetAsphalt',
    'GreenSea',
    'Nephritis',
    'BelizeHole',
    'Wisteria',
    'MidnightBlue',
    'SunFlower',
    'Carrot',
    'Alizarin',
    'Clouds',
    'Concrete',
    'Orange',
    'Pumpkin',
    'Pomegranate',
    'Silver',
    'Asbestos'
];

export type ColorPalette = 'Turquoise' | 'Emerald' | 'PeterRiver' | 'Amethyst' | 'WetAsphalt' | 'GreenSea' | 'Nephritis' | 'BelizeHole' | 'Wisteria' | 'MidnightBlue' | 'SunFlower' | 'Carrot' | 'Alizarin' | 'Clouds' | 'Concrete' | 'Orange' | 'Pumpkin' | 'Pomegranate' | 'Silver' | 'Asbestos' | 'Gray';

export const DefaultColorPalette = [
    Turquoise,
    Emerald,
    PeterRiver,
    Amethyst,
    WetAsphalt,
    GreenSea,
    Nephritis,
    BelizeHole,
    Wisteria,
    MidnightBlue,
    SunFlower,
    Carrot,
    Alizarin,
    Clouds,
    Concrete,
    Orange,
    Pumpkin,
    Pomegranate,
    Silver,
    Asbestos
];


export function getBackgroundColorFromName(name: ColorPalette) {
    switch (name) {
        case 'Turquoise':
            return 'bg-turquoise';
        case 'Emerald':
            return 'bg-emerald';
        case 'PeterRiver':
            return 'bg-peter-river';
        case 'Amethyst':
            return 'bg-amethyst';
        case 'WetAsphalt':
            return 'bg-wet-asphalt';
        case 'GreenSea':
            return 'bg-green-sea';
        case 'Nephritis':
            return 'bg-nephritis';
        case 'BelizeHole':
            return 'bg-belize-hole';
        case 'Wisteria':
            return 'bg-wisteria';
        case 'MidnightBlue':
            return 'bg-midnight-blue';
        case 'SunFlower':
            return 'bg-sun-flower';
        case 'Carrot':
            return 'bg-carrot';
        case 'Alizarin':
            return 'bg-alizarin';
        case 'Clouds':
            return 'bg-clouds';
        case 'Concrete':
            return 'bg-concrete';
        case 'Orange':
            return 'bg-orange';
        case 'Pumpkin':
            return 'bg-pumpkin';
        case 'Pomegranate':
            return 'bg-pomegranate';
        case 'Silver':
            return 'bg-silver';
        case 'Asbestos':
            return 'bg-asbestos';
        default:
            return 'bg-gray-200';
    }
}


export function getTextColorFromName(name: ColorPalette) {
    switch (name) {
        case 'Turquoise':
            return 'text-turquoise';
        case 'Emerald':
            return 'text-emerald';
        case 'PeterRiver':
            return 'text-peter-river';
        case 'Amethyst':
            return 'text-amethyst';
        case 'WetAsphalt':
            return 'text-wet-asphalt';
        case 'GreenSea':
            return 'text-green-sea';
        case 'Nephritis':
            return 'text-nephritis';
        case 'BelizeHole':
            return 'text-belize-hole';
        case 'Wisteria':
            return 'text-wisteria';
        case 'MidnightBlue':
            return 'text-midnight-blue';
        case 'SunFlower':
            return 'text-sun-flower';
        case 'Carrot':
            return 'text-carrot';
        case 'Alizarin':
            return 'text-alizarin';
        case 'Clouds':
            return 'text-clouds';
        case 'Concrete':
            return 'text-concrete';
        case 'Orange':
            return 'text-orange';
        case 'Pumpkin':
            return 'text-pumpkin';
        case 'Pomegranate':
            return 'text-pomegranate';
        case 'Silver':
            return 'text-silver';
        case 'Asbestos':
            return 'text-asbestos';
        default:
            return 'text-gray-500';
    }
}


export function getConstrastColorFromName(name: ColorPalette): string {
    switch (name) {
        case 'Turquoise':
            return 'text-white';
        case 'Emerald':
            return 'text-white';
        case 'PeterRiver':
            return 'text-white';
        case 'Amethyst':
            return 'text-white';
        case 'WetAsphalt':
            return 'text-white';
        case 'GreenSea':
            return 'text-white';
        case 'Nephritis':
            return 'text-white';
        case 'BelizeHole':
            return 'text-white';
        case 'Wisteria':
            return 'text-white';
        case 'MidnightBlue':
            return 'text-white';
        case 'SunFlower':
            return 'text-black';
        case 'Carrot':
            return 'text-black';
        case 'Alizarin':
            return 'text-white';
        case 'Clouds':
            return 'text-black';
        case 'Concrete':
            return 'text-black';
        case 'Orange':
            return 'text-black';
        case 'Pumpkin':
            return 'text-white';
        case 'Pomegranate':
            return 'text-white';
        case 'Silver':
            return 'text-black';
        case 'Asbestos':
            return 'text-black';
        default:
            return 'text-gray-500';
    }
}

export function getColorFromName(name: string, opaque: boolean = false): string {
    let firstLetter = name.charAt(0).toLowerCase();

    switch (firstLetter) {
        case 'a':
            return opaque ? `${getConstrastColorFromName('Turquoise')} ${getBackgroundColorFromName('Turquoise')}`:`${getTextColorFromName('Turquoise')} ${getBackgroundColorFromName('Turquoise')}/10`;
        case 'b':
            return opaque ? `${getConstrastColorFromName('Emerald')} ${getBackgroundColorFromName('Emerald')}`:`${getTextColorFromName('Emerald')} ${getBackgroundColorFromName('Emerald')}/10`;
        case 'c':
            return opaque ? `${getConstrastColorFromName('PeterRiver')} ${getBackgroundColorFromName('PeterRiver')}`:`${getTextColorFromName('PeterRiver')} ${getBackgroundColorFromName('PeterRiver')}/10`;
        case 'd':
            return opaque ? `${getConstrastColorFromName('Amethyst')} ${getBackgroundColorFromName('Amethyst')}`:`${getTextColorFromName('Amethyst')} ${getBackgroundColorFromName('Amethyst')}/10`;
        case 'e':
            return opaque ? `${getConstrastColorFromName('WetAsphalt')} ${getBackgroundColorFromName('WetAsphalt')}`:`${getTextColorFromName('WetAsphalt')} ${getBackgroundColorFromName('WetAsphalt')}/10`;
        case 'f':
            return opaque ? `${getConstrastColorFromName('GreenSea')} ${getBackgroundColorFromName('GreenSea')}`:`${getTextColorFromName('GreenSea')} ${getBackgroundColorFromName('GreenSea')}/10`;
        case 'g':
            return opaque ? `${getConstrastColorFromName('Nephritis')} ${getBackgroundColorFromName('Nephritis')}`:`${getTextColorFromName('Nephritis')} ${getBackgroundColorFromName('Nephritis')}/10`;
        case 'h':
            return opaque ? `${getConstrastColorFromName('BelizeHole')} ${getBackgroundColorFromName('BelizeHole')}`:`${getTextColorFromName('BelizeHole')} ${getBackgroundColorFromName('BelizeHole')}/10`;
        case 'i':
            return opaque ? `${getConstrastColorFromName('Wisteria')} ${getBackgroundColorFromName('Wisteria')}`:`${getTextColorFromName('Wisteria')} ${getBackgroundColorFromName('Wisteria')}/10`;
        case 'j':
            return opaque ? `${getConstrastColorFromName('MidnightBlue')} ${getBackgroundColorFromName('MidnightBlue')}`:`${getTextColorFromName('MidnightBlue')} ${getBackgroundColorFromName('MidnightBlue')}/10`;
        case 'k':
            return opaque ? `${getConstrastColorFromName('SunFlower')} ${getBackgroundColorFromName('SunFlower')}`:`${getTextColorFromName('SunFlower')} ${getBackgroundColorFromName('SunFlower')}/10`;
        case 'l':
            return opaque ? `${getConstrastColorFromName('Carrot')} ${getBackgroundColorFromName('Carrot')}`:`${getTextColorFromName('Carrot')} ${getBackgroundColorFromName('Carrot')}/10`;
        case 'm':
            return opaque ? `${getConstrastColorFromName('Alizarin')} ${getBackgroundColorFromName('Alizarin')}`:`${getTextColorFromName('Alizarin')} ${getBackgroundColorFromName('Alizarin')}/10`;
        case 'n':
            return opaque ? `${getConstrastColorFromName('Clouds')} ${getBackgroundColorFromName('Clouds')}`:`${getTextColorFromName('Clouds')} ${getBackgroundColorFromName('Clouds')}/10`;
        case 'o':
            return opaque ? `${getConstrastColorFromName('Silver')} ${getBackgroundColorFromName('Silver')}`:`${getTextColorFromName('Silver')} ${getBackgroundColorFromName('Silver')}/10`;
        case 'p':
            return opaque ? `${getConstrastColorFromName('Concrete')} ${getBackgroundColorFromName('Concrete')}`:`${getTextColorFromName('Concrete')} ${getBackgroundColorFromName('Concrete')}/10`;
        case 'q':
            return opaque ? `${getConstrastColorFromName('Pumpkin')} ${getBackgroundColorFromName('Pumpkin')}`:`${getTextColorFromName('Pumpkin')} ${getBackgroundColorFromName('Pumpkin')}/10`;
        case 'r':
            return opaque ? `${getConstrastColorFromName('Pomegranate')} ${getBackgroundColorFromName('Pomegranate')}`:`${getTextColorFromName('Pomegranate')} ${getBackgroundColorFromName('Pomegranate')}/10`;
        case 's':
            return opaque ? `${getConstrastColorFromName('Asbestos')} ${getBackgroundColorFromName('Asbestos')}`:`${getTextColorFromName('Asbestos')} ${getBackgroundColorFromName('Asbestos')}/10`;
        case 't':
            return opaque ? `${getConstrastColorFromName('Turquoise')} ${getBackgroundColorFromName('Turquoise')}`:`${getTextColorFromName('Turquoise')} ${getBackgroundColorFromName('Turquoise')}/10`;
        case 'u':
            return opaque ? `${getConstrastColorFromName('Emerald')} ${getBackgroundColorFromName('Emerald')}`:`${getTextColorFromName('Emerald')} ${getBackgroundColorFromName('Emerald')}/10`;
        case 'v':
            return opaque ? `${getConstrastColorFromName('PeterRiver')} ${getBackgroundColorFromName('PeterRiver')}`:`${getTextColorFromName('PeterRiver')} ${getBackgroundColorFromName('PeterRiver')}/10`;
        case 'w':
            return opaque ? `${getConstrastColorFromName('Amethyst')} ${getBackgroundColorFromName('Amethyst')}`:`${getTextColorFromName('Amethyst')} ${getBackgroundColorFromName('Amethyst')}/10`;
        case 'x':
            return opaque ? `${getConstrastColorFromName('WetAsphalt')} ${getBackgroundColorFromName('WetAsphalt')}`:`${getTextColorFromName('WetAsphalt')} ${getBackgroundColorFromName('WetAsphalt')}/10`;
        case 'y':
            return opaque ? `${getConstrastColorFromName('GreenSea')} ${getBackgroundColorFromName('GreenSea')}`:`${getTextColorFromName('GreenSea')} ${getBackgroundColorFromName('GreenSea')}/10`;
        case 'z':
            return opaque ? `${getConstrastColorFromName('Nephritis')} ${getBackgroundColorFromName('Nephritis')}`:`${getTextColorFromName('Nephritis')} ${getBackgroundColorFromName('Nephritis')}/10`;
        default:
            return opaque ? `${getConstrastColorFromName('Gray')} ${getBackgroundColorFromName('Gray')}`:`${getTextColorFromName('Gray')} ${getBackgroundColorFromName('Gray')}/10`;
    }
}