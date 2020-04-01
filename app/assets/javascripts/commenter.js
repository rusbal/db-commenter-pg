$(function() {

  $('summary').on('click', function() {
    $(this).blur()

    hilite($(this).parents('.row'))
  })

  initSettings()

  // Remote form submission

  $("form")
    .on("ajax:success", function(event) {
      var data, status, xhr, _ref
      _ref = event.detail, data = _ref[0], status = _ref[1], xhr = _ref[2]

      var response = JSON.parse(xhr.responseText)

      var table = response[0]
      var column = response[1]
      var comment = response[2]

      $(`#comment-display-${table}-${column}`).html(comment.replace(/\n/g, '<br>'))
      $(`#comment-${table}-${column}`).val(comment).blur()
    })
    .on("ajax:error", function(event) {
      console.log('Ajax error')
    })

  // Edit form

  $('.tr-column').on('click', function() {
    if (!$('#editMode').is(':checked')) return

    readMode()

    $(this)
      .find('.comment-display')
        .hide()

    $(this)
      .find('form')
        .show()
        .find('textarea.form-control')
          .focus()
  })

  var pristine_comment

  $('textarea.form-control')
    .on('keyup', function (e) {
      if (isESC(e)) {
        $(this).blur()
          .closest('form')
            .trigger('reset')

        readMode()
        return true
      }
    })
    .on('focus', function (e) {
      pristine_comment = $(this).val()
    })
    .on('blur', function (e) {
      var comment = $(this).val()

      if ($(this).val() === pristine_comment) return

      $(this).parents('form')
        .find('input[name=commit]')
          .click()
    })

  $('.comment-display')
    .on('dblclick', function(e) {
      $('#editMode').click()
      $(this).click()
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

function isESC(evt) {
  return (evt.keyCode ? evt.keyCode : evt.which) === 27
}

function initSettings() {
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
}
