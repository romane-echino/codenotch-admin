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

export type ColorPalette = 'Turquoise' | 'Emerald' | 'PeterRiver' | 'Amethyst' | 'WetAsphalt' | 'GreenSea' | 'Nephritis' | 'BelizeHole' | 'Wisteria' | 'MidnightBlue' | 'SunFlower' | 'Carrot' | 'Alizarin' | 'Clouds' | 'Concrete' | 'Orange' | 'Pumpkin' | 'Pomegranate' | 'Silver' | 'Asbestos';

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


export function getBackgroundColorFromName(name: string) {
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


export function getTextColorFromName(name: string) {
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


export function getConstrastColorFromName(name: string) {
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

export function getColorFromName(name: string) {
    let firstLetter = name.charAt(0).toLowerCase();

    switch (firstLetter) {
        case 'a':
            return 'text-turquoise bg-turquoise/10';
        case 'b':
            return 'text-emerald bg-emerald/10';
        case 'c':
            return 'text-peter-river bg-peter-river/10';
        case 'd':
            return 'text-amethyst bg-amethyst/10';
        case 'e':
            return 'text-wet-asphalt bg-wet-asphalt/10';
        case 'f':
            return 'text-green-sea bg-green-sea/10';
        case 'g':
            return 'text-nephritis bg-nephritis/10';
        case 'h':
            return 'text-belize-hole bg-belize-hole/10';
        case 'i':
            return 'text-wisteria bg-wisteria/10';
        case 'j':
            return 'text-midnight-blue bg-midnight-blue/10';
        case 'k':
            return 'text-sun-flower bg-sun-flower/10';
        case 'l':
            return 'text-carrot bg-carrot/10';
        case 'm':
            return 'text-alizarin bg-alizarin/10';
        case 'n':
            return 'text-gray-500 bg-clouds/10';
        case 'o':
            return 'text-gray-500 bg-silver/10';
        case 'p':
            return 'text-gray-500 bg-concrete/10';
        case 'q':
            return 'text-pumpkin bg-pumpkin/10';
        case 'r':
            return 'text-pomegranate bg-pomegranate/10';
        case 's':
            return 'text-asbestos bg-asbestos/10';
        case 't':
            return 'text-turquoise bg-turquoise/10';
        case 'u':
            return 'text-emerald bg-emerald/10';
        case 'v':
            return 'text-peter-river bg-peter-river/10';
        case 'w':
            return 'text-amethyst bg-amethyst/10';
        case 'x':
            return 'text-wet-asphalt bg-wet-asphalt/10';
        case 'y':
            return 'text-green-sea bg-green-sea/10';
        case 'z':
            return 'text-nephritis bg-nephritis/10';
        default:
            return 'text-gray-500 bg-gray-200/10';
    }
}