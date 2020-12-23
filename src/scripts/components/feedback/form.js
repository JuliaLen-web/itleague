import axios from 'axios'

window.addEventListener('load', () => {
  const forms = document.querySelectorAll('.registration__content-form')

  forms.forEach(form => {
    const content = form.closest('.registration__content')
    const fields = form.querySelectorAll('input, textarea')
    const requiredFields = form.querySelectorAll('input[required], textarea[required]')
    const button = form.querySelector('button[type=submit]')
    const preloader = content.querySelector('.registration__content-preloader')

    const listenerValue = event => {
      const field = event.target

      let input
      let parent
      let invalidClass

      if (field.type === 'text' || field.type === 'textarea') {
        input = field.closest('.form__item-input')
        parent = field.closest('.form__item')
        invalidClass = 'form__item_invalid'
      }

      if (field.type === 'checkbox') {
        parent = field.closest('.form__checkbox')
        invalidClass = 'form__checkbox_invalid'
      }

      if (input) {
        input.classList.toggle('form__item-input_active', !!event.target.value)
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

    const focus = event => {
      const field = event.target
      const parent = field.closest('.form__item')

      if (field.type !== 'checkbox') {
        parent.classList.toggle('form__item_active', event.type === 'focus')
      }
    }

    fields.forEach(field => field.addEventListener('change', listenerValue))
    fields.forEach(field => field.addEventListener('input', listenerValue))
    fields.forEach(field => field.addEventListener('focus', focus))
    fields.forEach(field => field.addEventListener('blur', focus))

    form.addEventListener('submit', (e) => {
      e.preventDefault()

      if (invalid()) {
        return false
      }

      let formData = new FormData(form)

      preloader.classList.add('registration__content-preloader_active')
      button.setAttribute('disabled', 'disabled')

      axios
        .post('/', formData, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]')
          }
        })
        .then(() => {
          content.classList.add('registration__content_success')
        })
        .catch(error => {
          if (error.response.status === 422) {
            handleErrors(error.response.data.errors)
          }
        })

      preloader.classList.remove('registration__content-preloader_active')
      button.removeAttribute('disabled')
    })
  })
})
