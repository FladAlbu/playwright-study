import { test, expect } from '@playwright/test'

import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, postTask } from './support/helpers'
import { TasksPage } from './support/pages/tasks'

import data from './fixtures/tasks.json'

let tasksPage: TasksPage

test.beforeEach(({ page }) => {
    tasksPage = new TasksPage(page)
})

test.describe('Cadastro de nova tarefa', () => {
    test('deve poder cadastrar uma nova tarefa', async ({ request }) => {

        const task = data.success as TaskModel

        // Dado que eu tenho uma nova tarefa
        await deleteTaskByHelper(request, task.name)
        // E que estou na página de cadastro
        await tasksPage.go()
        // Quando faço o cadastro dessa tarefa
        await tasksPage.create(task)
        // Então essa tarefa deve ser exibida na lista4
        await tasksPage.shouldHaveText(task.name)
    })

    test('não deve permitir tarefa duplicada', async ({ request }) => {

        const task = data.duplicate as TaskModel

        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)

        await tasksPage.go()
        await tasksPage.create(task)
        await tasksPage.alertHaveText('Task already exists!')
    })

    test('campo obrigatório', async () => {
        const task = data.required as TaskModel

        await tasksPage.go()
        await tasksPage.create(task)
        await tasksPage.alertRequired()
    })
})

test.describe('Atualização de tarefa', () => {

    test('deve editar uma tarefa', async ({ request }) => {
        const task = data.update as TaskModel

        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)

        await tasksPage.go()
        await tasksPage.toggle(task.name)
        await tasksPage.shouldBeDone(task.name)
    })
})
test.describe('Exclusão de tarefa', () => {

    test('deve excluir uma tarefa', async ({ request }) => {
        const task = data.update as TaskModel

        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)

        await tasksPage.go()
        await tasksPage.removeTask(task.name)
        await tasksPage.shouldNotExist(task.name)
    })
})
