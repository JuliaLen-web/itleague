import axios from 'axios'

window.addEventListener('load', () => {
  const form = document.querySelector('.feedback__form')
  const content = form.closest('.feedback__content')
  const fields = form.querySelectorAll('input, textarea')
  const requiredFields = form.querySelectorAll('input[required], textarea[required]')
  const button = form.querySelector('button[type=submit]')
  const preloader = content.querySelector('.feedback__content-preloader')

  const listenerValue = event => {
    const field = event.target

    let parent
    let invalidClass

    if (field.type === 'text' || field.type === 'textarea') {
      parent = field.closest('.form__item')
      invalidClass = 'form__item_invalid'
    }

    if (field.type === 'checkbox') {
      parent = field.closest('.form__checkbox')
      invalidClass = 'form__checkbox_invalid'
    }

    if (parent) {
      parent.classList.remove(invalidClass)
    }

    button.toggleAttribute('disabled', invalid())
  }

  const invalid = () => {
    let invalid = false

    requiredFields.forEach(field => {
      if ((field.type === 'text' || field.type === 'textarea') && !field.value) {
        invalid = true
      }

      if (field.type === 'checkbox' && !field.checked) {
        invalid = true
      }
    })

    return invalid
  }

  const handleErrors = (errors) => {
    for (const [key, value] of Object.entries(errors)) {
      const field = form.querySelector('[name=' + key + ']')

      let parent
      let text
      let invalidClass

      if (!field) {
        continue
      }

      if (field.type === 'text' || field.type === 'textarea') {
        parent = field.closest('.form__item')
        invalidClass = 'form__item_invalid'
      }

      if (field.type === 'checkbox') {
        parent = field.closest('.form__checkbox')
        invalidClass = 'form__checkbox_invalid'
      }

      if (parent) {
        parent.classList.add(invalidClass)
      }

      text = parent.querySelector('.form__item_invalid-text')

      if (text) {
        text.innerHTML = value
      }
    }
  }

  fields.forEach(field => field.addEventListener('change', listenerValue))
  fields.forEach(field => field.addEventListener('input', listenerValue))

  grecaptcha.ready(function() {
    form.addEventListener('submit', (e) => {
      e.preventDefault()

      if (invalid()) {
        return false
      }

      let formData = new FormData(form)

      preloader.classList.add('feedback__content-preloader_active')
      button.setAttribute('disabled', 'disabled')

      grecaptcha.execute(document.head.querySelector('meta[name="g-recaptcha-key"]').content, {action: 'submit'}).then(function(token) {

        formData.append('g-recaptcha-response', token)
        axios
          .post('/', formData, {
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content
            }
          })
          .then(() => {
            content.classList.add('feedback__content_success')
          })
          .catch(error => {
            if (error.response.status === 422) {
              handleErrors(error.response.data.errors)
            }
          })

        preloader.classList.remove('feedback__content-preloader_active')
        button.removeAttribute('disabled')
      })
    })
  })
})
