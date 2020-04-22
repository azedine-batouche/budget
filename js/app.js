var budgetController = (function () {
  // BUDGET CONTROLLER
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.pourcentage = -1;
  };

  Expense.prototype.calPourcentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.pourcentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.pourcentage = -1;
    }
  };
  Expense.prototype.getPourcentage = function () {
    return this.pourcentage;
  };
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (item) {
      sum += item.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    pourcentage: -1,
  };

  return {
    addItem: function (type, des, val) {
      var newItem, id;
      // Create new id
      if (data.allItems[type].length > 0) {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        id = 0;
      }
      // create new item based on type selection
      if (type === 'exp') {
        newItem = new Expense(id, des, val);
      } else if (type === 'inc') {
        newItem = new Income(id, des, val);
      }
      // push item into data structure
      data.allItems[type].push(newItem);

      return newItem;
    },

    deleteItem: function (type, id) {
      var ids, index;

      ids = data.allItems[type].map(function (current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },
    calculateBudget: function () {
      //calculate total incomme and total expenses
      calculateTotal('inc');
      calculateTotal('exp');
      //update budget
      data.budget = data.totals.inc - data.totals.exp;
      //calculate pourcentage
      if (data.totals.inc > 0) {
        data.pourcentage = Math.round(
          (data.totals.exp / data.totals.inc) * 100
        );
      } else {
        data.pourcentage = -1;
      }
    },

    calculatePourcentage: function () {
      data.allItems.exp.forEach(function (item) {
        item.calPourcentage(data.totals.inc);
      });
    },
    getPourcentage: function () {
      var allItemPourcentage = data.allItems.exp.map(function (item) {
        return item.getPourcentage();
      });
      return allItemPourcentage;
    },
    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        pourcentage: data.pourcentage,
      };
    },
    testing: function () {
      return console.log(data);
    },
  };
})();

// UI CONTOLLER
var UIController = (function () {
  var domStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    pourcentageLabel: '.budget__expenses--percentage',
    container: '.container',
    pourcentageValue: '.item__percentage',
    monthLabel: '.budget__title--month',
  };

  var formatNumber = function (num, type) {
    var numSplit,
      int,
      sign = '';
    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');
    int = parseInt(numSplit[0]);

    if (type === 'inc' && int !== 0) {
      sign = '+';
    } else if (type === 'exp' && int !== 0) {
      sign = '-';
    } else if ((type === 'exp' || type === 'inc') && int === 0) {
      console.log('access');
      sign = '';
    }
    int = int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return sign + int + '€';
  };

  var nodeListForEach = function (list, callback) {
    for (let index = 0; index < list.length; index++) {
      callback(list[index], index);
    }
  };

  return {
    getInput: function () {
      return {
        description: document.querySelector(domStrings.inputDescription).value,
        type: document.querySelector(domStrings.inputType).value,
        value: parseFloat(document.querySelector(domStrings.inputValue).value),
      };
    },
    addListItem: function (item, type) {
      var html, newHtml, element;
      // Add html item based on type of each item
      // 1 add placeholder text into html : %id%, %description%, %value%
      if (type === 'inc') {
        element = domStrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = domStrings.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Remplace the placeholder text with data

      newHtml = html.replace('%id%', item.id);
      newHtml = newHtml.replace('%description%', item.description);
      newHtml = newHtml.replace('%value%', formatNumber(item.value, type));

      // Add new html element into the dom
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
    deleteListItem: function (selectorId) {
      var el = document.getElementById(selectorId);
      el.parentNode.removeChild(el);
    },

    clearflieds: function () {
      var fields, fieldsArr;
      fields = document.querySelectorAll(
        domStrings.inputDescription + ',' + domStrings.inputValue
      );
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function (field) {
        field.value = '';
      });
      fieldsArr[0].focus();
    },
    displayBudget: function (budget) {
      var type;
      budget.budget > 0 ? (type = 'inc') : (type = 'exp');
      document.querySelector(domStrings.incomeLabel).textContent = formatNumber(
        budget.totalInc,
        'inc'
      );
      document.querySelector(
        domStrings.expensesLabel
      ).textContent = formatNumber(budget.totalExp, 'exp');

      document.querySelector(domStrings.budgetLabel).textContent = formatNumber(
        budget.budget,
        type
      );
      if (budget.pourcentage > 0 && budget.totalInc > budget.totalExp) {
        document.querySelector(domStrings.pourcentageLabel).textContent =
          budget.pourcentage + '%';
      } else {
        document.querySelector(domStrings.pourcentageLabel).textContent = '---';
      }
    },

    displayPoucentages: function (pourcentages) {
      var fields = document.querySelectorAll(domStrings.pourcentageValue);

      nodeListForEach(fields, function (item, index) {
        var totalInc = document.querySelector(domStrings.incomeLabel);
        var totalExp = document.querySelector(domStrings.expensesLabel).value;
        if (pourcentages[index] > 0 && pourcentages[index] < 100) {
          item.textContent = pourcentages[index] + '%';
        } else {
          item.textContent = '---';
        }
      });
    },

    displayMonth: function () {
      const event = new Date();
      const options = {
        month: 'long',
      };
      var month = event.toLocaleDateString(undefined, options);
      document.querySelector(domStrings.monthLabel).textContent = month;
    },
    changeType: function () {
      var fields = document.querySelectorAll(
        domStrings.inputType +
          ',' +
          domStrings.inputDescription +
          ',' +
          domStrings.inputValue
      );
      nodeListForEach(fields, function (item) {
        item.classList.toggle('red-focus');
      });

      document.querySelector(domStrings.inputBtn).classList.toggle('red');
    },
    getDOMstrings: function () {
      return domStrings;
    }, 
  };
})();

// GLOBAL APP  CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {
  // Access to variables definitions
  var dom = UICtrl.getDOMstrings();

  var setupEventListener = function () {
    document.querySelector(dom.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(dom.container)
      .addEventListener('click', ctrlDeleteItem);

    document
      .querySelector(dom.inputType)
      .addEventListener('change', UICtrl.changeType);
  };

  var updateBudget = function () {
    // Calculate the budget
    budgetCtrl.calculateBudget();

    // Retour the budget
    var budget = budgetCtrl.getBudget();

    // display the budget in th UI
    UICtrl.displayBudget(budget);
  };

  var updatePourcentage = function () {
    //    Calculate the pourcentage
    budgetCtrl.calculatePourcentage();

    // Read Poucentage from budget
    var poucentages = budgetCtrl.getPourcentage();

    //Update UI with the new pourcentage
    UICtrl.displayPoucentages(poucentages);
  };

  var ctrlAddItem = function () {
    var input, newItem;

    // Get the input fileds data
    input = UICtrl.getInput();

    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // Add item into data structure
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // Add item into th UI
      UICtrl.addListItem(newItem, input.type);

      // Clear flieds
      UICtrl.clearflieds();

      //Calculate and update the budget
      updateBudget();

      // Calculate and update the pourcentage
      updatePourcentage();
    }
  };

  var ctrlDeleteItem = function (event) {
    var itemId, splitId, type, id;
    itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemId) {
      splitId = itemId.split('-');
      type = splitId[0];
      id = parseInt(splitId[1]);

      // Delete the item from the data structure
      budgetCtrl.deleteItem(type, id);

      //Deletethe item from the UI
      UICtrl.deleteListItem(itemId);

      // Update and show the new budget
      updateBudget();

      // Calculate and update the pourcentage
      updatePourcentage();
    }
  };

  return {
    init: function () {
      console.log('eventlistener init');
      UIController.displayMonth();
      UIController.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        pourcentage: -1,
      });
      setupEventListener();
    },
  };
})(budgetController, UIController);

// LAUNCH MAIN CONTROLLER
controller.init();
