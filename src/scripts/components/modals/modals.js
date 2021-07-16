import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

window.addEventListener('load', () => {
  const modalBtn = document.querySelectorAll('[data-modal]')
  const modals = document.querySelectorAll('.modal')
  const close = document.querySelectorAll('.modal__close')
  const body = document.querySelector('body')

  let activeModal

  const toggleModal = (id) => {
    const modal = document.querySelector(`.modal#${id}`)
    activeModal = modal

    if (!modal) {
      return false
    }

    modal.classList.toggle('modal_active')

    if (document.querySelector('.modal__active')) {
      body.classList.add('body_fixed')
    } else {
      body.classList.remove('body_fixed')
    }
  }

  const closeModals = (event) => {
    event.stopPropagation()
    const list = event.target.classList

    if (list.contains('modal')) {
      activeModal.classList.remove('modal_active')
    }
  }

  modals.forEach(el => el.addEventListener('click', closeModals))

  modalBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      toggleModal(btn.getAttribute('data-modal'), e)
    })
  })

  close.forEach(el => el.addEventListener('click', (e) => {
    activeModal.classList.remove('modal_active')
  }))
})
