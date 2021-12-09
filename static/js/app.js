const addContactBtn = document.querySelector('.add-contact-info-btn');
const addContactForm = document.querySelector('#add-contact-form');
const saveInfoView = document.querySelector('#save-info-view');
const closeBtn = document.querySelector('.close-btn');
const contactList = document.querySelector('.display-info');


class PhoneBook{
    constructor(name, phone, email){
        this.name = name;
        this.phone = phone;
        this.email = email;
    }
}

class PhoneBookUI{
    static saveContactInfoUI(phoneBook){
        const displayInfoUI = document.querySelector('.display-info');
        const div = document.createElement('div');

        div.classList = 'column is-3';
        div.innerHTML = `
            <div class="card">
                <div class="card-content">
                    <div class="media-content">
                        <p class="title is-5">${phoneBook.name}</p>
                        <p class="subtitle">
                            <span>
                                <i class="fas fa-mobile-alt mx-2"></i>${phoneBook.phone}
                            </span>
                            <br>
                            <span>
                                <i class="fas fa-envelope-square mx-2"></i>${phoneBook.email}
                            </span>
                        </p>
                    </div>
                </div>
                <footer class="card-footer">
                    <a href="#" class="card-footer-item edit"><i class="fas fa-edit fa-gradient"></i></a>
                    <a href="#" class="card-footer-item delate"><i class="fas fa-trash-alt fa-gradient"></i></a>
                </footer>
            </div>
        `;

        displayInfoUI.appendChild(div);
    }

    static clearFields(){
        document.querySelector('#full-name').value = '';
        document.querySelector('#phone-number').value = '';
        document.querySelector('#email-address').value = '';
    }

    // Display Message on the screen
    static showMessage(message, className){
        const article = document.createElement('article');
        const div = document.createElement('div');
        const text = document.createTextNode(message);

        // Get parent Element
        const panel = document.querySelector('.panel');

        article.classList = `message meassage-alert ${className} is-small`;
        div.classList = `message-body`;
        div.appendChild(text);
        article.appendChild(div);

        panel.insertBefore(article,saveInfoView);

        // Remove Aleart After 3 sec
        setTimeout(() => {
            document.querySelector('.meassage-alert').remove()
        }, 3000);
    }
    // Get targer from display-info UI
    static getTargetContactUI(element){
        // Remove This Contact from ui
        if(element.classList.contains('fa-trash-alt')){
            element.parentElement.parentElement.parentElement.parentElement.remove();
        }
        else if(element.classList.contains('fa-edit')){
            console.log(element);
        }
    }
}

// Save Contact Info in local store
class Store{
    // Get Item From Local Store
    static getPhoneBook(){
        let phoneBook;
        if(localStorage.getItem('phoneBook') === null){
            phoneBook = [];
        }else{
            phoneBook = JSON.parse(localStorage.getItem('phoneBook'));
        }

        return phoneBook;
    }

    // Display PhoneBook List In UI
    static displayPhoneBook(){
        let phoneBook = Store.getPhoneBook();

        phoneBook.forEach((val) => {
            PhoneBookUI.saveContactInfoUI(val);
        });
    }

    // Save Contact Info in local Store
    static saveContactLocalStore(contactInfo){
        let phoneBook = Store.getPhoneBook();

        phoneBook.push(contactInfo);

        localStorage.setItem('phoneBook', JSON.stringify(phoneBook));        
    }
}

// Show Contact List When Page Is load in Screen
document.addEventListener('DOMContentLoaded', Store.displayPhoneBook());

// Close Button Event Listener
closeBtn.addEventListener('click', (e) => {
    e.target.parentElement.parentElement.toggleAttribute('hidden');
});

// Show or Hide addContactForm Event Listener
addContactBtn.addEventListener('click',() => {
    saveInfoView.toggleAttribute('hidden');
});

// Save Contact Information Event Listener
addContactForm.addEventListener('submit',(e) => {
    const name = document.querySelector('#full-name').value;
    const phone = document.querySelector('#phone-number').value;
    const email = document.querySelector('#email-address').value;
    // Instantiate PhoneBook
    const phoneBook = new PhoneBook(name, phone, email);
    
    // Validation
    if(name === '' || phone === ''){
        // Call Show Message Method
        PhoneBookUI.showMessage('Your must have to fill phone number and name','is-danger');
    }else{
        // Instatiate PhoneBookUI Class
        PhoneBookUI.saveContactInfoUI(phoneBook);
        Store.saveContactLocalStore(phoneBook);
        PhoneBookUI.clearFields();
        // Hide 'Save Contact UI' Form After succesfully submit
        if(e.target.id ==='add-contact-form'){
            e.target.parentElement.toggleAttribute('hidden');
        }
        // Call Show Message Method
        PhoneBookUI.showMessage('Phone number has been saved!','is-primary');
    }
    e.preventDefault();
    console.log(e.target);
    console.table(phoneBook);
});

// Delate Contact From Contact List
contactList.addEventListener('click', (e) => {
    // Remove From UI
    PhoneBookUI.getTargetContactUI(e.target);
});
