const selector = (value) =>  document.querySelector(value)
const selectorAll = (value) =>  document.querySelectorAll(value)
let pizzaWindow = selector('.pizzaWindowArea')
let pizzaQuantity = 1
let pizzaData
let cart = []

pizzaJson.map((data, index) => {
  let pizzaItem = selector('.models .pizza-item').cloneNode(true)

  pizzaItem.querySelector('.pizza-item--name').innerText = data.name
  pizzaItem.querySelector('.pizza-item--desc').innerText = data.description
  pizzaItem.querySelector('.pizza-item--price').innerText = formatPrice(data.price)
  pizzaItem.querySelector('.pizza-item--img img').setAttribute('src', data.img)

  // OPENING AND POPULATING MODAL
  pizzaItem.querySelector('a').addEventListener('click',(e) => {
    e.preventDefault()
    
    pizzaQuantity = 1
    pizzaData = index
    selector('.pizzaInfo h1').innerText = data.name
    selector('.pizzaInfo .pizzaInfo--desc').innerText = data.description
    selector('.pizzaBig img').setAttribute('src', data.img)
    selector('.pizzaInfo--actualPrice').innerText = formatPrice(data.price)

    // PIZZA QUANTITY RESET ON MODAL OPEN
    selector('.pizzaInfo--qt').innerText = pizzaQuantity
    pizzaWindow.classList.add('pizzaWindowActive')
    selector('body').classList.add('noScroll')

    // LIST PIZZA SIZES
    selector('.pizzaInfo--size.selected').classList.remove('selected')
    
    selectorAll('.pizzaInfo--size').forEach((size, id) => {
      if (id === 2) {
        size.classList.add('selected')
      }
      size.querySelector('span').innerText = pizzaJson[index].sizes[id]
    })    
  })
  
  // INSERT CLICKED PIZZA DATA INTO MODAL
  selector('.pizza-area').append( pizzaItem )
})

function formatPrice(amount) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount)
}

// CLOSING MODAL
function closeModal() {
  pizzaWindow.classList.remove('pizzaWindowActive')
  selector('body').classList.remove('noScroll')
}

selector('.pizzaInfo--cancelMobileButton').addEventListener('click',() => closeModal())
selector('.pizzaInfo--cancelButton').addEventListener('click',() => closeModal())

// HANDLE PIZZA QUANTITY
selector('.pizzaInfo--qtmenos').addEventListener('click',() => {
  pizzaQuantity -= 1

  if (pizzaQuantity < 1) {
    pizzaQuantity = 1
  }

  selector('.pizzaInfo--qt').innerText = pizzaQuantity
})

selector('.pizzaInfo--qtmais').addEventListener('click',() => {
  pizzaQuantity += 1
  selector('.pizzaInfo--qt').innerText = pizzaQuantity
})

// CHOOSE PIZZA SIZE
selectorAll('.pizzaInfo--size').forEach((pizzaSize) => {
  pizzaSize.addEventListener('click',() => {
    selector('.pizzaInfo--size.selected').classList.remove('selected')
    pizzaSize.classList.add('selected')
  })
})

// ADD TO CART
selector('.pizzaInfo--addButton').addEventListener('click',() => {
  
  const selectedSize = Number(selector('.pizzaInfo--size.selected').getAttribute('data-key'))
  let identifier = `${pizzaJson[pizzaData].id}#${selectedSize}`

  let key = cart.findIndex(item => item.identifier === identifier)
  
  if ( key > -1 ) {
    cart[key].quantity += pizzaQuantity
  } else {
    cart.push({
      identifier,
      id: pizzaJson[pizzaData].id,
      size: selectedSize,
      quantity: pizzaQuantity
    })
  }

  updateCart()
  closeModal()
})

// CHECKOUT
selector('.cart--finalizar').addEventListener('click',() => {
  cart = []
  selector('aside').classList.remove('show')
})

// HANDLE CART UPDATE
function updateCart() {

  selector('.menu-openner span').innerText = cart.length

  if (cart.length > 0) {
    selector('aside').classList.add('show')
    selector('.cart').innerHTML = ''

    let subtotal = 0
    const coupon = 0.1
    let discount = 0
    let total = 0

    for( let each in cart ) {
      
      let cartData = pizzaJson.find((item) => item.id === cart[each].id)
      let cartItem = selector('.cart--item').cloneNode(true)
      let pizzaSize = ''

      let SubtotalCalc = cart[each].quantity * cartData.price
      subtotal += SubtotalCalc


      switch (cart[each].size) {
        case 0:
          pizzaSize = 'P'
          break;
        case 1:
          pizzaSize = 'M'
          break;
        case 2:
          pizzaSize = 'G'
          break;
      }
      let pizzaNameAndSize = cartData.name+' <b>('+pizzaSize+')</b>'

      cartItem.querySelector('.cart--item-nome').innerHTML = pizzaNameAndSize
      cartItem.querySelector('img').setAttribute('src', cartData.img)
      cartItem.querySelector('.cart--item--qt').innerText = cart[each].quantity

      //CART QUANTITY BUTTONS
      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
        if (cart[each].quantity > 1) {
          cart[each].quantity--
        } else {
          cart.splice(each, 1)
        }
        updateCart()
      })

      cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
        cart[each].quantity++
        updateCart()
      })
      
      selector('.cart').append( cartItem )
    }

    discount = subtotal * coupon
    total = subtotal - discount

    selector('.subtotal-value').innerText = formatPrice(subtotal)
    selector('.discount-value').innerText = formatPrice(discount)
    selector('.total-value').innerText = formatPrice(total)

  } else {
    selector('aside').classList.remove('show')
    selector('aside').style.left = '100vw'

  }
}

// HANDLE MOBILE CART
selector('.menu-openner').addEventListener('click',(e) => {
  
  if (cart.length > 0) {
    selector('aside').style.left = '0'
  }
})

selector('.menu-closer').addEventListener('click',() => {
  selector('aside').style.left = '100vw'

})
