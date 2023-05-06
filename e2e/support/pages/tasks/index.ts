import { Locator, Page, expect } from '@playwright/test'
import { TaskModel } from '../../../fixtures/task.model'

export class TasksPage {

    readonly page: Page
    readonly inputTaskName: Locator

    constructor(page: Page) {
        this.page = page
        this.inputTaskName = page.locator('input[class*=InputNewTask]')

    }

    async go() {
        await this.page.goto('/')
    }

    async create(task: TaskModel) {
        //Opções para realizar a mapeamento e busca de elementos pelo seletor CSS
        //await page.fill('#newTask', 'Ler um livro de TypeScript')
        //await page.fill('input[placeholder="Add a new Task"]', 'Ler um livro de TypeScript')
        //await page.fill('input[type=text]', 'Ler um livro de TypeScript')

        // Esse não é recomendado pois muda a cada versão
        //await page.fill('._listInputNewTask_1y0mp_21', 'Ler um livro de TypeScript')

        //Uma alternativa é fazer assim:
        //await page.fill('input[class*=InputNewTask]', 'Ler um livro de TypeScript')   
        await this.inputTaskName.fill(task.name)

        //Alternativas para realizar a submissão do formulário
        //este simula realizar o clique da tecla 'Enter' do teclado
        // await inputTaskName.press('Enter')

        //Este realiza o clique no botão, tem duas formas para achar o botão, a pelo xpath(padrão)
        //await page.click('xpath=//button[contains(text(),"Create")]')

        //ou essa exclusiva do playwright, mais elegante
        await this.page.click('css=button >> text=Create')
    }

    async toggle(taskName: string) {
        const target = this.page.locator(`xpath=//p[text()="${taskName}"]/..//button[contains(@class,"Toggle")]`)
        await target.click()
    }

    async removeTask(taskName: string){
        const target = this.page.locator(`xpath=//p[text()="${taskName}"]/..//button[contains(@class,"Delete")]`)
        await target.click()
    }

    async shouldHaveText(taskName: string) {
        //opção para buscar por id
        //const target = page.getByTestId('task-item')
        //opção para buscar por nome da classe
        //const target = page.locator('.task-item')
        //Opção para achar o nome da classe, caso não esteja legal e use apenas o dinâmico
        //const target = page.locator('div[class*=listItem]')
        //Modo Playwright dinâmico
        const target = this.page.locator(`css=.task-item p >> text=${taskName}`)
        await expect(target).toBeVisible()
    }

    async shouldNotExist(taskName: string){
        const target = this.page.locator(`css=.task-item p >> text=${taskName}`)
        await expect(target).not.toBeVisible()
    }

    async alertHaveText(text: string) {
        const target = this.page.locator('.swal2-html-container')
        await expect(target).toHaveText(text)
    }

    async alertRequired() {
        const validationMessage = await this.inputTaskName.evaluate(e => (e as HTMLInputElement).validationMessage)
        expect(validationMessage).toEqual('This is a required field')
    }

    async shouldBeDone(taskName: string) {
        const target = this.page.getByText(taskName)
        await expect(target).toHaveCSS('text-decoration-line', 'line-through')
    }
}