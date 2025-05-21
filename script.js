let price = 1.87;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];

const cashInput     = document.getElementById("cash");
const purchaseBtn   = document.getElementById("purchase-btn");
const changeDueEl   = document.getElementById("change-due");
const drawerDisplay = document.getElementById("cash-drawer-display");

function computeChange(changeDue, cid) {
  const denominations = [
    ["ONE HUNDRED", 100],
    ["TWENTY", 20],
    ["TEN", 10],
    ["FIVE", 5],
    ["ONE", 1],
    ["QUARTER", 0.25],
    ["DIME", 0.1],
    ["NICKEL", 0.05],
    ["PENNY", 0.01]
  ];

  let remaining = Math.round(changeDue * 100);
  let changeArray = [];

  let cidMap = {};
  cid.forEach(item => {
    cidMap[item[0]] = Math.round(item[1] * 100);
  });

  for (let [name, value] of denominations) {
    let denomValue = Math.round(value * 100);
    let amountUsed = 0;

    while (remaining >= denomValue && cidMap[name] > 0) {
      remaining -= denomValue;
      cidMap[name] -= denomValue;
      amountUsed += denomValue;
    }

    changeArray.push([name, amountUsed / 100]);
  }

  if (remaining > 0) {
    return { success: false };
  }
  return { success: true, change: changeArray };
}

function renderDrawer(fromCid) {
  drawerDisplay.innerHTML = fromCid
    .map(item => `${item[0]}: $${item[1].toFixed(2)}`)
    .join("<br>");
}

const priceScreen = document.getElementById("price-screen");
priceScreen.textContent = `Total: $${price.toFixed(2)}`;

renderDrawer(cid);

purchaseBtn.addEventListener("click", () => {
  let cashValue = parseFloat(cashInput.value);

  if (cashValue < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }

  if (cashValue === price) {
    changeDueEl.textContent = "No change due - customer paid with exact cash";
    renderDrawer(cid);
    return;
  }

  let changeDue = Math.round((cashValue - price) * 100) / 100;

  let totalCID = cid.reduce((sum, curr) => sum + curr[1], 0);
  totalCID = Math.round(totalCID * 100) / 100;

  if (totalCID === changeDue) {
    let closedStr = "Status: CLOSED";
    const denomValues = {
      "ONE HUNDRED": 100,
      "TWENTY": 20,
      "TEN": 10,
      "FIVE": 5,
      "ONE": 1,
      "QUARTER": 0.25,
      "DIME": 0.1,
      "NICKEL": 0.05,
      "PENNY": 0.01
    };

    let nonZeroCID = cid.filter(item => item[1] > 0);
    nonZeroCID.sort((a, b) => denomValues[b[0]] - denomValues[a[0]]);
    nonZeroCID.forEach(item => {
      closedStr += ` ${item[0]}: $${item[1]}`;
    });
    changeDueEl.textContent = closedStr;

    renderDrawer(cid);
    return;
  }

  if (totalCID < changeDue) {
    changeDueEl.textContent = "Status: INSUFFICIENT_FUNDS";
    drawerDisplay.textContent = "";
    return;
  }

  let changeResult = computeChange(changeDue, cid);

  if (!changeResult.success) {
    changeDueEl.textContent = "Status: INSUFFICIENT_FUNDS";
    drawerDisplay.textContent = "";
  } else {
    let resultStr = "Status: OPEN";

    let newCid = cid.map(entry => [...entry]);
    changeResult.change.forEach(([unit, amt]) => {
      if (amt > 0) {
        resultStr += ` ${unit}: $${amt}`;
        for (let e of newCid) {
          if (e[0] === unit) {
            e[1] = +(e[1] - amt).toFixed(2);
          }
        }
      }
    });
    changeDueEl.textContent = resultStr;

    renderDrawer(newCid);                               
  }
});
