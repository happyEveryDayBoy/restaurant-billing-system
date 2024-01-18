import { createSlice } from "@reduxjs/toolkit";

const items = [
    {
        item_code: 1,
        item_name: "BASUNTHI",
        price: 32
    },
    {
        item_code: 2,
        item_name: "IDLY",
        price: 13
    },
    {
        item_code: 3,
        item_name: "MEDHU VADAI",
        price: 20
    },
    {
        item_code: 4,
        item_name: "BONDA",
        price: 20
    },
    {
        item_code: 5,
        item_name: "PONGAL",
        price: 40
    },
    {
        item_code: 6,
        item_name: "POORI 1SET",
        price: 50
    },
    {
        item_code: 7,
        item_name: "RAVA DOSAI",
        price: 50
    },
    {
        item_code: 8,
        item_name: "KAL DOSAI",
        price: 35
    },
    {
        item_code: 9,
        item_name: "FILTER COFFEE",
        price: 17
    },
    {
        item_code: 10,
        item_name: "DOSAI",
        price: 50
    },
    {
        item_code: 11,
        item_name: "MASALA DOSAI",
        price: 65
    },
    {
        item_code: 12,
        item_name: "GHEE ROAST",
        price: 75
    },
    {
        item_code: 13,
        item_name: "IDIAPPAM KURMA",
        price: 50
    },
    {
        item_code: 14,
        item_name: "CHAPPATHI S.DISH",
        price: 50
    },
    {
        item_code: 15,
        item_name: "PAROTTA 1SET",
        price: 50
    },
    {
        item_code: 16,
        item_name: "MINIBONDA\/VADAI",
        price: 10
    },
    {
        item_code: 17,
        item_name: "ONION RAVA",
        price: 65
    },
    {
        item_code: 18,
        item_name: "ONION UTHAPPAM",
        price: 65
    },
    {
        item_code: 19,
        item_name: "SETDOSAI VADACURRY",
        price: 60
    },
    {
        item_code: 20,
        item_name: "KOIL IDLY",
        price: 25
    },
    {
        item_code: 21,
        item_name: "SEMIA IDLY",
        price: 25
    },
    {
        item_code: 22,
        item_name: "VADA CURRY",
        price: 15
    },
    {
        item_code: 23,
        item_name: "ADAI AVIYAL",
        price: 80
    },
    {
        item_code: 24,
        item_name: "MINI MEALS",
        price: 80
    },
    {
        item_code: 25,
        item_name: "MAKAN BEDA",
        price: 20
    },
    {
        item_code: 26,
        item_name: "MAGNALODA BONDA",
        price: 20
    },
    {
        item_code: 27,
        item_name: "MINI RAVA",
        price: 35
    },
    {
        item_code: 28,
        item_name: "VEG. SAMOSA",
        price: 25
    },
    {
        item_code: 29,
        item_name: "CHOLA POORI",
        price: 65
    },
    {
        item_code: 30,
        item_name: "LIMITED MEALS",
        price: 90
    },
    {
        item_code: 31,
        item_name: "PARCEL MEALS",
        price: 90
    },
    {
        item_code: 32,
        item_name: "SAMBAR RICE",
        price: 40
    },
    {
        item_code: 33,
        item_name: "CURD RICE",
        price: 40
    },
    {
        item_code: 34,
        item_name: "PULI RICE",
        price: 40
    },
    {
        item_code: 35,
        item_name: "VADAI SAMBAR",
        price: 25
    },
    {
        item_code: 36,
        item_name: "MORKUZHAMBHU\/RASA VADAI",
        price: 30
    },
    {
        item_code: 37,
        item_name: "CURD VADAI",
        price: 30
    },
    {
        item_code: 38,
        item_name: "MASALA VADAI",
        price: 10
    },
    {
        item_code: 39,
        item_name: "PATANI BATH",
        price: 40
    },
    {
        item_code: 40,
        item_name: "RAVA PONGAL",
        price: 40
    },
    {
        item_code: 41,
        item_name: "CHINESE COMBO",
        price: 130
    },
    {
        item_code: 42,
        item_name: "BRINJI KURMA",
        price: 50
    },
    {
        item_code: 43,
        item_name: "PARCEL KURMA",
        price: 40
    },
    {
        item_code: 44,
        item_name: "PARCEL IDLY",
        price: 15
    },
    {
        item_code: 45,
        item_name: "KICHADI",
        price: 40
    },
    {
        item_code: 46,
        item_name: "RAVA KESARI",
        price: 20
    },
    {
        item_code: 47,
        item_name: "BADAM HALWA",
        price: 30
    },
    {
        item_code: 48,
        item_name: "KASI HALWA",
        price: 25
    },
    {
        item_code: 49,
        item_name: "CASHEW HALWA",
        price: 30
    },
    {
        item_code: 50,
        item_name: "GULAB JAMUN",
        price: 10
    },
    {
        item_code: 51,
        item_name: "SURATH KARI",
        price: 25
    },
    {
        item_code: 52,
        item_name: "LADDU",
        price: 15
    },
    {
        item_code: 53,
        item_name: "BADAM KHEER",
        price: 50
    },
    {
        item_code: 54,
        item_name: "TEA",
        price: 2240
    },
    {
        item_code: 55,
        item_name: "PARCEL COFFEE",
        price: 40
    },
    {
        item_code: 56,
        item_name: "MINERAL WATER 1 LITRE",
        price: 20
    },
    {
        item_code: 57,
        item_name: "MINERAL WATER 2 LITRE",
        price: 38
    },
    {
        item_code: 58,
        item_name: "CURD",
        price: 10
    },
    {
        item_code: 59,
        item_name: "GHEE 14 IDLY",
        price: 70
    },
    {
        item_code: 60,
        item_name: "SAMBAR BONDA",
        price: 25
    },
    {
        item_code: 61,
        item_name: "MUSHROOM DOSAI",
        price: 90
    },
    {
        item_code: 62,
        item_name: "PANEER DOSAI",
        price: 90
    },
    {
        item_code: 63,
        item_name: "PUTHINA DOSAI",
        price: 60
    },
    {
        item_code: 64,
        item_name: "EXTRA ITEM 2",
        price: 40
    },
    {
        item_code: 65,
        item_name: "GHEE PODI IDLY",
        price: 25
    },
    {
        item_code: 66,
        item_name: "JANGIRI",
        price: 75
    },
    {
        item_code: 67,
        item_name: "EXTRA RICE",
        price: 30
    },
    {
        item_code: 68,
        item_name: "VADAI    ",
        price: 20
    },
    {
        item_code: 69,
        item_name: "APPALAM",
        price: 5
    },
    {
        item_code: 70,
        item_name: "POORI 1PC",
        price: 25
    },
    {
        item_code: 71,
        item_name: "EXTRA ITEM  ",
        price: 30
    },
    {
        item_code: 72,
        item_name: "PARCEL TEA",
        price: 45
    },
    {
        item_code: 73,
        item_name: "PARCEL VADACURRY",
        price: 40
    },
    {
        item_code: 74,
        item_name: "PAROTA/CHAPPATI 1",
        price: 25
    },
    {
        item_code: 75,
        item_name: "SAMBAR VADAI/PARCEL",
        price: 40
    },
    {
        item_code: 76,
        item_name: "DHALL POWDER 250GMS",
        price: 75
    },
    {
        item_code: 77,
        item_name: "CASHEW HALWA 100GMS",
        price: 80
    },
    {
        item_code: 78,
        item_name: "PAKODA KUMAR",
        price: 15
    },
    {
        item_code: 79,
        item_name: "MILK",
        price: 17
    },
    {
        item_code: 80,
        item_name: "MIXTURE 250GMS",
        price: 75
    },
    {
        item_code: 81,
        item_name: "7UP",
        price: 40
    },
    {
        item_code: 82,
        item_name: "EXECUTIVE MEALS",
        price: 110
    },
    {
        item_code: 83,
        item_name: "CUP IDLY",
        price: 25
    },
    {
        item_code: 84,
        item_name: "ATHIRASAM",
        price: 25
    },
    {
        item_code: 85,
        item_name: "MIXTURE 100GMS",
        price: 32
    },
    {
        item_code: 86,
        item_name: "PINEAPPLE PUDDING",
        price: 25
    },
    {
        item_code: 87,
        item_name: "MINI TIFFIN",
        price: 60
    },
    {
        item_code: 88,
        item_name: "SPECIAL LIMITED MEALS",
        price: 130
    },
    {
        item_code: 89,
        item_name: "PARCEL LIMITIED MEALS",
        price: 100
    },
    {
        item_code: 90,
        item_name: "BUTTER MILK",
        price: 15
    },
    {
        item_code: 91,
        item_name: "COOL 600",
        price: 38
    },
    {
        item_code: 92,
        item_name: "JUICE 600",
        price: 42
    },
    {
        item_code: 93,
        item_name: "COOL 250",
        price: 20
    },
    {
        item_code: 94,
        item_name: "JUICE 250",
        price: 15
    },
    {
        item_code: 95,
        item_name: "ORANGE",
        price: 25
    },
    {
        item_code: 96,
        item_name: "ICE CREAM",
        price: 30
    },
    {
        item_code: 97,
        item_name: "ICECREAM",
        price: 35
    },
    {
        item_code: 98,
        item_name: "PODI DOSAI",
        price: 65
    },
    {
        item_code: 99,
        item_name: "CHINESE COMBO",
        price: 150
    },
    {
        item_code: 100,
        item_name: "CHINESE COMBO",
        price: 130
    },
    {
        item_code: 201,
        item_name: "FRIED RICE",
        price: 120
    },
    {
        item_code: 202,
        item_name: "MUSHROOM FRIED RICE",
        price: 140
    },
    {
        item_code: 203,
        item_name: "GOBI FRIED RICE",
        price: 130
    },
    {
        item_code: 204,
        item_name: "PANEER FRIED RICE",
        price: 140
    },
    {
        item_code: 205,
        item_name: "NOODLES",
        price: 120
    },
    {
        item_code: 206,
        item_name: "PANEER NOODLES",
        price: 140
    },
    {
        item_code: 207,
        item_name: "GOBI NOODLES",
        price: 130
    },
    {
        item_code: 208,
        item_name: "MUSHROOM NOODLES",
        price: 140
    },
    {
        item_code: 209,
        item_name: "PANEER 65",
        price: 140
    },
    {
        item_code: 210,
        item_name: "GOBI 65",
        price: 130
    },
    {
        item_code: 211,
        item_name: "MUSHROOM 65",
        price: 140
    },
    {
        item_code: 212,
        item_name: "GOBI MANCHURIAN",
        price: 130
    },
    {
        item_code: 213,
        item_name: "PANEER MANCHURIAN",
        price: 140
    },
    {
        item_code: 214,
        item_name: "PANEER BUTTER MASALA",
        price: 140
    },
    {
        item_code: 215,
        item_name: "GOBI MASALA",
        price: 130
    },
    {
        item_code: 216,
        item_name: "MUSHROOM MASALA",
        price: 140
    },
    {
        item_code: 217,
        item_name: "MIXED VEG MASALA",
        price: 130
    },
    {
        item_code: 218,
        item_name: "CHILLI PAROTA",
        price: 120
    },
    {
        item_code: 219,
        item_name: "KOTTHU PAROTA",
        price: 120
    },
    {
        item_code: 220,
        item_name: "KAIMA IDLY",
        price: 110
    },
    {
        item_code: 221,
        item_name: "pHULKA",
        price: 20
    },
    {
        item_code: 222,
        item_name: "NAAN",
        price: 30
    },
    {
        item_code: 223,
        item_name: "BUTTER NAAN",
        price: 35
    },
    {
        item_code: 224,
        item_name: "ROTTI",
        price: 30
    },
    {
        item_code: 225,
        item_name: "BUTTER ROTTI",
        price: 35
    },
    {
        item_code: 226,
        item_name: "CUTLET",
        price: 15
    },
    {
        item_code: 227,
        item_name: "ICE CREAM",
        price: 130
    },
    {
        item_code: 228,
        item_name: "SCHEZHWAN FRIED RICE",
        price: 130
    },
    {
        item_code: 229,
        item_name: "SCHEZWAN NOODLES",
        price: 130
    },
    {
        item_code: 230,
        item_name: "DRAGON PANEER",
        price: 140
    },
    {
        item_code: 231,
        item_name: "DRAGON MUSHROOM DRY",
        price: 140
    },
    {
        item_code: 232,
        item_name: "DRAGON GOBI DRY",
        price: 130
    },
    {
        item_code: 233,
        item_name: "GOBI PEPPER FRY",
        price: 130
    },
    {
        item_code: 234,
        item_name: "PANEER PEPPER FRY",
        price: 140
    },
    {
        item_code: 235,
        item_name: "MUSHROOM PEPPER FRY",
        price: 140
    },
    {
        item_code: 236,
        item_name: "CHILLY MUSHROOM",
        price: 130
    },
    {
        item_code: 237,
        item_name: "CHILLY PANEER",
        price: 140
    },
    {
        item_code: 238,
        item_name: "CHILLY GOBI",
        price: 130
    },
    {
        item_code: 239,
        item_name: "VEG. BRIIYANI",
        price: 130
    },
    {
        item_code: 240,
        item_name: "pANEER BRIYANI",
        price: 140
    },
    {
        item_code: 241,
        item_name: "MUSHROOM BIRYANI",
        price: 140
    },
    {
        item_code: 242,
        item_name: "GOBI BIRYANI",
        price: 140
    }

]

const itemsSlice = createSlice({
    name: "itemsSlice",
    initialState: items,
    reducers: {
        getItems: (state) => state
    }
})

export const { getItems } = itemsSlice.actions;
export default itemsSlice.reducer;