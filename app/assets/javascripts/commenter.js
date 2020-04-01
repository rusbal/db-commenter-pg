$(function() {

  // Remote form submission

  $("form").on("ajax:success", function(event) {
    var data, status, xhr, _ref
    _ref = event.detail, data = _ref[0], status = _ref[1], xhr = _ref[2]

    var response = JSON.parse(xhr.responseText)
    console.log('Success: ', response)

    var table = response[0]
    var column = response[1]
    var comment = response[2]

    $(`#comment-display-${table}-${column}`).html(comment)

  }).on("ajax:error", function(event) {
    console.log('Ajax error')
  })

  $('textarea').on('blur', function() {
    var comment = $(this).parents('.comment').find('.comment-display').html()

    if (/Empty doc/.test(comment) === false) {
      $(this).val(comment)
    }
  })

  // Settings

  $('#editMode').on('click', function() {
    if ($(this).is(':checked')) {
      $('.group-row').removeClass('read-mode')
    } else {
      $('.group-row').addClass('read-mode')
      readMode()
    }
  })

  $('#showAll').on('click', function() {
    if ($(this).is(':checked')) {
      $('tr.hidden-column').show()
    } else {
      $('tr.hidden-column').hide()
    }
  })

  $('#showForeignId').on('click', function() {
    if ($(this).is(':checked')) {
      $('tr.foreign-id').show()
    } else {
      $('tr.foreign-id').hide()
    }
  })

  $('#expandAll').on('click', function() {
    if ($(this).is(':checked')) {
      setTableAsActive($('details'), 'hilite-ccc')
    } else {
      $('details').removeAttr('open')
      $('.row.hilite-ccc').removeClass('hilite-ccc')
    }
  })

  $('summary').on('click', function() {
    $(this).blur()

    hilite($(this).parents('.row'))
  })

  // Edit form

  $('.tr-column').on('click', function() {
    if (!$('#editMode').is(':checked')) return

    readMode()

    $(this)
      .find('.comment-display')
      .hide()

    var textarea = $(this)
      .find('form')
        .show()
        .find('textarea.form-control')

    // Move cursor to end of input
    var value = textarea.val()
    textarea.focus().val('').val(value)
  })

  $('textarea.form-control')
    .keyup(function (e) {
      var code = (e.keyCode ? e.keyCode : e.which)
      if (code === 27) {
        $(this).closest('form').trigger('reset')
        readMode()
        return true
      }
    })
    .keypress(function (e) {
      var code = (e.keyCode ? e.keyCode : e.which);

      if (code === 13) {
        $(this).parents('form')
          .find('input[name=commit]').click()

        return true
      }
    })

  $('a.foreign-links').on('click', function(evt) {
    evt.preventDefault()
    evt.stopPropagation()

    var id = $(this).attr('href')
    var dom = $('#' + id)

    if (dom.length === 0) return

    setTableAsActive(dom.parent('details'))
    dom[0].scrollIntoView()
  })

  $('.group-row').on('click', function() {
    hilite($(this))
  })

  $('textarea').on('keyup, focusin', function(e) {
    while($(this).outerHeight() < (
      this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth"))
    )) {
      $(this).height($(this).height()+1)
    }
  })
})

function readMode() {
  $('form').hide()
  $('.comment-display').show()
}

function setTableAsActive(dom, klass = 'hilite') {
  dom.attr('open', true)
  hilite(dom.parents('.row'), klass)
}

function hilite(row, klass = 'hilite') {
  if (klass === 'hilite') {
    $('.row.hilite')
      .removeClass('hilite')
      .addClass('hilite-ccc')
  }

  row
    .removeClass('hilite-ccc')
    .addClass(klass)
}

