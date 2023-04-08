export class GithubUser {
    static search(username) {
        const endPoint = `https://api.github.com/users/${username}`
        return fetch(endPoint)
            .then(data => data.json())
            .then(({ login, name, public_repos, followers }) => ({
                login,
                name,
                public_repos,
                followers

            }))

    }

}


export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
       GithubUser.search('diego3g').then(user => console.log(user))
    }

    load() {
        this.entries = localStorage.getItem('@git-hub-favorites') || []

    }
    async add( userToAdd){
        const userResult = await GithubUser.search(userToAdd)
        console.log(userResult)

    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry =>
            entry.login !== user.login)


        this.entries = filteredEntries
        this.update()
    }

}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector(' table tbody')
        this.update()
        this.onaddPerson()
    }

    onaddPerson(){
        const addButton = this.root.querySelector('.search button')
        addButton.onclick =()=>{
            const {value} = this.root.querySelector('.search input')
            this.add(value)
            
        }
    }

    update() {
        this.removeAllTr()

        this.entries.forEach((user) => {
            const row = this.createRow()
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem do perfil do ${user.name}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repo
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