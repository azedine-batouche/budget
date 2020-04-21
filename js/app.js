var budgetController = (function () {
  // BUDGET CONTROLLER
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
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
      if (data.allItems[type].lenght > 0) {
        id = data.allItems[type][data.allItems[type].lenght - 1].id + 1;
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
    calculateBudget() {
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
          '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = domStrings.expensesContainer;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Remplace the placeholder text with data
      if (html !== undefined) {
        newHtml = html.replace('%id%', item.id);
        newHtml = newHtml.replace('%description%', item.description);
        newHtml = newHtml.replace('%value%', item.value);
      }

      // Add new html element into the dom
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
      document.querySelector(domStrings.budgetLabel).textContent =
        budget.budget;
      document.querySelector(domStrings.incomeLabel).textContent =
        budget.totalInc;
      document.querySelector(domStrings.expensesLabel).textContent =
        budget.totalExp;

      if (budget.pourcentage > 0) {
        document.querySelector(domStrings.pourcentageLabel).textContent =
          budget.pourcentage + '%';
      } else {
        document.querySelector(domStrings.pourcentageLabel).textContent = '---';
      }
    },

    getDOMstrings: function () {
      return domStrings;
    },
  };
})();

// GLOBAL APP  CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {
  var setupEventListener = function () {
    document.querySelector(dom.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  // Access to variables definitions
  var dom = UICtrl.getDOMstrings();

  var updateBudget = function () {
    // Calculate the budget
    budgetCtrl.calculateBudget();

    // Retour the budget
    var budget = budgetCtrl.getBudget();

    // display the budget in th UI
    UICtrl.displayBudget(budget);
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
    }
  };

  return {
    init: function () {
      console.log('eventlistener init');
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
