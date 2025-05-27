/// <reference types="cypress" />

const NAMES = {
  SAUCE: 'Соус традиционный галактический',
  BUN  : 'Флюоресцентная булка R2-D3'
} as const

const IDS = {
  SAUCE: '643d69a5c3f7b9001cfa0944',
  BUN  : '643d69a5c3f7b9001cfa093d'
} as const

const SEL = {
  ITEM        : '[data-testid="ingredient-item"]',
  MAIN_AREA   : '[data-testid="constructor-main-ingredients"]',
  BUN_TOP     : '[data-testid="constructor-bun-top"]',
  BUN_BOTTOM  : '[data-testid="constructor-bun-bottom"]',
  MODAL       : '[data-testid="modal"]',
  MODAL_CLOSE : '[data-testid="modal-close"]'
} as const

const addIngredientDnD = (name: string, targetSel: string) => {
  cy.get(SEL.ITEM).contains(name).trigger('dragstart', { force: true })
  cy.get(targetSel).trigger('drop', { force: true })
}

const addIngredientClick = (name: string) => {
  cy.get(SEL.ITEM)
    .contains(name)
    .parents('li')
    .find('button')
    .contains('Добавить')
    .click()
}

beforeEach(() => {
  cy.intercept('GET',  '**/api/auth/user',   { fixture: 'user.json'        }).as('getUser')
  cy.intercept('GET',  '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients')
  cy.intercept('POST', '**/api/orders',      { fixture: 'order.json'       }).as('createOrder')
  cy.visit('/')
  cy.wait(['@getUser', '@getIngredients'])
})

afterEach(() => {
  cy.clearLocalStorage()
  cy.clearCookies()
})

describe('Конструктор бургера', () => {
  it('отображает ингредиенты из фикстуры', () => {
    cy.contains('Соберите бургер')
    cy.get(SEL.ITEM).contains(NAMES.SAUCE)
    cy.get(SEL.ITEM).contains(NAMES.BUN)
  })

  context('Добавление ингредиентов', () => {
    it('добавление соуса через drag-and-drop', () => {
      cy.get(SEL.MAIN_AREA).should('contain', 'Выберите начинку')
      addIngredientDnD(NAMES.SAUCE, SEL.MAIN_AREA)
      cy.get(SEL.MAIN_AREA).should('contain', NAMES.SAUCE)
    })

    it('добавление булки через кнопку «Добавить»', () => {
      cy.get(SEL.BUN_TOP).should('contain', 'Выберите булки')
      addIngredientClick(NAMES.BUN)
      cy.get(SEL.BUN_TOP).should('contain', `${NAMES.BUN} (верх)`)
      cy.get(SEL.BUN_BOTTOM).should('contain', `${NAMES.BUN} (низ)`)
    })
  })

  context('Модальное окно ингредиента', () => {
    beforeEach(() => {
      window.localStorage.setItem('accessToken', 'mock.access.token')
      cy.setCookie('refreshToken', 'mock.refresh.token')
    })

    it('открывается, показывает данные и закрывается', () => {
      cy.get(SEL.ITEM)
        .contains(NAMES.SAUCE)
        .parents('li')
        .find('a')
        .click({ force: true })

      cy.url().should('include', `/ingredients/${IDS.SAUCE}`)
      cy.get(SEL.MODAL).should('exist')
      cy.contains('Калории,').parent().contains('99')
      cy.contains('Белки,').parent().contains('42')
      cy.contains('Жиры,').parent().contains('24')
      cy.contains('Углеводы,').parent().contains('42')
      cy.get(SEL.MODAL_CLOSE).click()
      cy.get(SEL.MODAL).should('not.exist')
    })
  })

  context('Создание заказа', () => {
    beforeEach(() => {
      window.localStorage.setItem('accessToken', 'mock.access.token')
      cy.setCookie('refreshToken', 'mock.refresh.token')
    })

    it('оформляет заказ и очищает конструктор', () => {
      addIngredientClick(NAMES.BUN)
      addIngredientDnD(NAMES.SAUCE, SEL.MAIN_AREA)

      cy.contains('button', 'Оформить заказ').click()
      cy.wait('@createOrder')
      
      cy.get(SEL.MODAL).should('contain', '79129')

      cy.get(SEL.MODAL_CLOSE).click()
      cy.get(SEL.MODAL).should('not.exist')

      cy.get(SEL.BUN_TOP).should('contain', 'Выберите булки')
      cy.get(SEL.MAIN_AREA).should('contain', 'Выберите начинку')
    })
  })
})
