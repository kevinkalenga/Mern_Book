import {createSlice} from '@reduxjs/toolkit'
import {updateCart} from '../utils/cartUtils' 

// Définition de l’état initial du panier
// Si un panier existe déjà dans le localStorage, on le récupère
// Sinon, on initialise un panier vide avec PayPal comme moyen de paiement par défaut
const initialState = localStorage.getItem("cart") ? 
      JSON.parse(localStorage.getItem("cart")):{cartItems: [], shippingAddress: {}, paymentMethod:"PayPal"}

// Création du slice "cart" avec Redux Toolkit
const cartSlice = createSlice({
    name:"cart", // Nom du slice
    initialState,
    reducers: {
         // === Action : Ajouter un produit au panier ===
        addToCart: (state, action) => {
            // On enlève certaines propriétés inutiles du payload (user, rating, etc.)
            // et on garde uniquement les infos produit
            const {user, rating, numReviews, reviews, ...item} = action.payload 
            // Vérifie si le produit existe déjà dans le panier
            const existItem = state.cartItems.find((x) => x._id === item._id)

            if(existItem) {
                 // Si le produit existe, on le remplace par la nouvelle version (quantité mise à jour par ex.)
                state.cartItems = state.cartItems.map((x) => x._id === existItem._id ? item : x)
            } else {
                 // Sinon, on ajoute le nouveau produit au panier
                state.cartItems = [...state.cartItems, item]
            }
            // Met à jour le panier via updateCart (sauvegarde localStorage et calculs)
            return updateCart(state, item)
        },
          // === Action : Supprimer un produit du panier === 
        removeFromCart: (state, action) => {
            // On garde tous les articles sauf celui dont l’ID correspond au payload
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload)
             // On met à jour le localStorage et l’état
            return updateCart(state)
        },
         // === Action : Sauvegarder l’adresse de livraison ===
        saveShippingAddress:(state, action) => {
             // On met à jour l’adresse de livraison dans l’état
            state.shippingAddress = action.payload;
             // On sauvegarde le panier dans le localStorage
            localStorage.setItem("cart",JSON.stringify(state))
        },
         // === Action : Sauvegarder le mode de paiement ===
        savePaymentMethod: (state, action) => {
             // On met à jour le mode de paiement dans l’état
            state.paymentMethod = action.payload;
             // On sauvegarde le panier dans le localStorage
            localStorage.setItem("cart", JSON.stringify(state))
        },
         // === Action : Vider complètement le panier ===
        clearCartItems: (state, action) => {
             // On vide les articles du panier
            state.cartItems = []
             // On sauvegarde le nouvel état dans le localStorage
            localStorage.setItem("cart", JSON.stringify(state))
        },
         // === Action : Réinitialiser le panier ===
        resetCart:(state) => (state = initialState)

    }
})

// Export des actions générées automatiquement par createSlice
// On pourra les utiliser dans les composants avec dispatch()
export const {
    addToCart,
    removeFromCart,
    saveShippingAddress,
    savePaymentMethod,
    clearCartItems,
    resetCart
} = cartSlice.actions 

// Export du reducer du slice, qui sera intégré dans le store Redux
export default cartSlice.reducer;