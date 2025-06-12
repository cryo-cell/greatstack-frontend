import hero from './hero.png'
import landing from './landing.png'
import appDownload from './appDownload.png'
import search_icon from './search_icon.png'
import shopping_cart from './shopping_cart.png'
import user_icon from './user_icon.png'
import menu from './menu.png'
import usfLogo from './usfLogo.png'


export const assets = {
    hero,
    landing,
    appDownload,
    search_icon,
    shopping_cart,
    user_icon,
    menu,
    usfLogo
}

export const products = [
    {
        _id: "aaaaa",
        name: "Burger",
        description: "lorem",
        image: [hero, landing, appDownload],
        attributes: [],
        category: "Smoke",
        subCategory: "Nicotine",
        sizes: [{size: '0.5g', price: 25}],
        date: new Date(),
        bestseller: false
    },
    {
        _id: "aaaab",
        name: "Slam",
        description: "lorem",
        image: [hero, landing, appDownload],
        attributes: [{name: "indica", visible:true}],
        category: "Vape",
        subCategory: "THC",
        sizes: [{size: '0.5g', price: 25}, {size: '1g', price: 50},{size: '2g', price: 75}],
        date: new Date(),
        bestseller: false
    }
    
]