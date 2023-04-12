import { GithubUser } from "./githubUser.js"


export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()

    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []

    }
    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }
    async add(userToAdd) {
        try {
            const userExists = this.entries.find(entry => entry.login === userToAdd)
            console.log(userExists)
            if (userExists) {
                throw new Error(`${userToAdd} \n já existe!`)
            }

            const userResult = await GithubUser.search(userToAdd)
            console.log(userResult)
            if (userResult.login === undefined) {
                throw new Error(`${userToAdd} \n não encontrado`)
            }                           // spread opérator
            this.entries = [userResult, ...this.entries]
            this.update()
            this.save()
        } catch (error) {
            alert(error.message)
        }

    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry =>
            entry.login !== user.login)


        this.entries = filteredEntries
        this.update()
        this.save()
    }

}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector(' table tbody')
        this.update()
        this.onaddPerson()
    }

    onaddPerson() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')
            this.add(value)

        }
    }

    update() {
        this.removeAllTr()

        this.entries.forEach((user) => {
            const row = this.createRow()
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user img').alt = `Imagem do perfil do ${user.name}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers
            this.tbody.appendChild(row)

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm(`Deseja remover ${user.name} da lista de favoritos?`)

                if (isOk) {
                    this.delete(user)
                }
            }
        })


    }

    createRow() {
        const tr = document.createElement('tr')
        tr.innerHTML = `<td class="user">
          <img src="https://github.com/maykbrito.png"
            alt="imagem de perfil do Mayk Brito"
          />
          <a href="https://github.com/maykbrito" target="_blank">
            <p>Mayk Brito</p>
            <span>maykbrito</span>
          </a>
        </td>
        <td class="repositories">76</td>
        <td class="followers">9589</td>
        <td><button class="remove">&times;</button></td>`

        return tr

    }

    removeAllTr() {

        this.tbody.querySelectorAll('tr')
            .forEach((tr) => {
                tr.remove()
            })
    }
}