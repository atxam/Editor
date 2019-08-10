var editor1 = CodeMirror.fromTextArea(document.getElementById('editor1'), {
  mode: "text/html",
  lineNumbers: true,
  // lineWrapping: true,

})
var editor2 = CodeMirror.fromTextArea(document.getElementById('editor2'), {
  lineNumbers: true,

})
var result1 = CodeMirror.fromTextArea(document.getElementById('result1'), {
  lineNumbers: true,

})

var result2 = CodeMirror.fromTextArea(document.getElementById('result2'), {
  lineNumbers: true,

});

var data1 = [];
var data2 = [];
var check = null;

editor1.on('change', function (e) {
  data1 = takeAndclearData(e);
  if (data1.length && data2.length) {
    check = true;
    $('input[name="customRadio"]').prop('disabled', false);
  } else {
    check = false;
    $('input[name="customRadio"]').prop('disabled', true);
  }
  // lines count
  $('.header-editor1-info').html("Lines: " + editor1.lineCount());
});

editor2.on('change', function (e) {
  data2 = takeAndclearData(e);
  if (data1.length && data2.length) {
    check = true;
    $('input[name="customRadio"]').prop('disabled', false);
  } else {
    check = false;
    $('input[name="customRadio"]')
      .prop('disabled', true)
      .prop('checked', false);


  }

  // lines count
  $('.header-editor2-info').html("Lines: " + editor2.lineCount());
});

result1.on('change', function () {
  $('.header-result1-info').html("Lines: " + result1.lineCount());
});

result2.on('change', function () {
  $('.header-result2-info').html("Lines: " + result2.lineCount());
})

$('#run').on('click', () => {
  var result1 = cloneArr(data1);
  var result2 = cloneArr(data2);
  var deleteDuplicateFromOneForm = $('#deleteDuplicateFromOneForm').is(":checked");
  var sortByABC = $('#sortByABC').is(":checked");
  if (check) var radio = $('input[name="customRadio"]:checked').val();

  if (deleteDuplicateFromOneForm) {
    result1 = deleteDuplicates(result1);
    result2 = deleteDuplicates(result2);
  }

  if (sortByABC) {
    result1
      .sort() // sort by abc
      .sort((a, b) => { // sort by numberic
        return a - b;
      });

    result2
      .sort() // sort by abc
      .sort((a, b) => { // sort by numberic
        return a - b;
      })
  }

  if (check) {
    switch (radio) {
      case 'fromOneDelTwo':
        if (deleteDuplicateFromOneForm || sortByABC) result1 = fromOneDelTwo(result1, result2);
        else result1 = fromOneDelTwo(data1, data2);
        result2 = [];
        break;

      case 'fromTwoDelOne':
        if (deleteDuplicateFromOneForm || sortByABC) result2 = fromOneDelTwo(result2, result1);
        else result2 = fromOneDelTwo(data2, data1);
        result1 = [];
        break;

      case 'stayOfBoth':
        if (deleteDuplicateFromOneForm || sortByABC) result1 = result2 = stayOfBoth(result1, result2);
        else {
          result1 = stayOfBoth(data1, data2);
          result2 = stayOfBoth(data2, data1);
        }
        break;
    }
  }

  print_result1(result1);
  print_result2(result2);
});


function takeAndclearData(editor) {
  var $data = editor
    .getValue()
    .split('\n')
    .map((elem) => elem.trim())
    .filter((elem) => !!elem);

  return $data;
}

function deleteDuplicates(dataArr) {
  var result = dataArr.filter((elem, i, self) => {
    return !!elem && i === self.indexOf(elem);
  });
  return result;
};

function fromOneDelTwo(cleaning, data) {
  var result = cleaning.filter((elem, i, self) => {
    return !data.find((el) => {
      return elem == el;
    });
  });

  return result;
};

function stayOfBoth(data1, data2) {
  var result = data1.filter((elem, i, self) => {
    return data2.find((el) => {
      return elem == el;
    });
  });

  return result;
};

function cloneArr(oldArr) {
  return $.merge([], oldArr);
}

function print_result1(result) {
  result1.setValue(result.join('\n'));
}

function print_result2(result) {
  result2.setValue(result.join('\n'));
}

$('input[name="customRadio"]').click(function (e) {
  if (e.ctrlKey) {
    $(this).prop('checked', false);
  }
});

$('input[name="customRadio"]').prop('disabled', true);

$('button[title="Копировать"]').on('click', function () {
  // copy clipboard
  var editorName = $(this).attr('data-editor');
  var editor = window[editorName];
  var $temp = $("<textarea>");
  $("body").append($temp);
  $temp.val(editor.getValue()).select();
  document.execCommand("copy");
  $temp.remove();

  // Tooltip
  $(this).attr('data-original-title', 'Скопировано!');
  $(this).tooltip("show");
});

$('button[title="Очистить форму"]').on('click', function () {
  var editorName = $(this).attr('data-editor');
  var editor = window[editorName];
  editor.setValue('');

  $(this).tooltip("hide");
});

$('button[rel="tooltip"]').tooltip();