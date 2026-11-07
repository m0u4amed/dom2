// ====== Adjust these selectors if your HTML uses other class names ======
const SELECTORS = {
  plus: ".fa-plus-circle, .plus-btn",
  minus: ".fa-minus-circle, .minus-btn",
  remove: ".fa-trash-alt, .delete-btn",
  like: ".fa-heart, .like-btn",
  quantity: ".quantity",     // element showing only the quantity number
  unitPrice: ".unit-price",  // price of ONE item
  itemTotal: ".item-total",  // optional: unit price x quantity
  cartTotal: ".total",       // whole cart total
};
const LIKED_COLOR = "red";
const DEFAULT_COLOR = "";

const toNumber = (text) => parseFloat(String(text).replace(/[^\d.]/g, "")) || 0;

// Walk up from a clicked element until we find the item containing a unit price
function getItem(el) {
  let node = el.parentElement;
  while (node && !node.querySelector(SELECTORS.unitPrice)) {
    node = node.parentElement;
  }
  return node;
}

function updateTotal() {
  let total = 0;
  document.querySelectorAll(SELECTORS.unitPrice).forEach((priceEl) => {
    const item = getItem(priceEl);
    const qty = toNumber(item.querySelector(SELECTORS.quantity).textContent);
    const lineTotal = toNumber(priceEl.textContent) * qty;
    total += lineTotal;

    const itemTotalEl = item.querySelector(SELECTORS.itemTotal);
    if (itemTotalEl) itemTotalEl.textContent = lineTotal + " $";
  });
  const totalEl = document.querySelector(SELECTORS.cartTotal);
  if (totalEl) totalEl.textContent = total + " $";
}

// One listener handles every item (event delegation)
document.addEventListener("click", (e) => {
  const plus = e.target.closest(SELECTORS.plus);
  const minus = e.target.closest(SELECTORS.minus);
  const remove = e.target.closest(SELECTORS.remove);
  const like = e.target.closest(SELECTORS.like);

  if (plus || minus) {
    const item = getItem(plus || minus);
    const qtyEl = item.querySelector(SELECTORS.quantity);
    let qty = toNumber(qtyEl.textContent);
    qty = plus ? qty + 1 : Math.max(0, qty - 1); // never below 0
    qtyEl.textContent = qty;
    updateTotal();
  } else if (remove) {
    getItem(remove).remove();
    updateTotal();
  } else if (like) {
    const liked = like.dataset.liked === "true";
    like.dataset.liked = String(!liked);
    like.style.color = liked ? DEFAULT_COLOR : LIKED_COLOR;
  }
});

updateTotal(); // initial total on page load