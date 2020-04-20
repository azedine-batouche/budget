// BUDGET CONTROLLER
var budgetController = (function () {})();

// UI CONTOLLER
var UIController = (function () {
  var domStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
  };

  return {
    getInput: function () {
      return {
        description: document.querySelector(domStrings.inputDescription).value,
        type: document.querySelector(domStrings.inputType).value,
        value: document.querySelector(domStrings.inputValue).value,
      };
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

  var dom = UICtrl.getDOMstrings();

  var ctrlAddItem = function () {
    var input = UICtrl.getInput();

    console.log('works!');
    console.log(input);
  };

  return {
    init: function () {
      console.log('eventlistener init');
      setupEventListener();
    },
  };
})(budgetController, UIController);

// LAUNCH MAIN CONTROLLER
controller.init();
