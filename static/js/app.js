const addContactBtn = document.querySelector('.add-contact-info-btn');
const addContactForm = document.querySelector('#add-contact-form');
const saveInfoView = document.querySelector('#save-info-view');
const closeBtn = document.querySelector('.close-btn');
const contactList = document.querySelector('.display-info');
const displayInfoUI = document.querySelector('.display-info');
const searchInput = document.querySelector('#search');
const panelTabsBtn = document.querySelector('.panel-tabs')


class PhoneBook{
    constructor(name, phone, email, id = Math.floor(new Date())){
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.favorite = false;
    }
}

class PhoneBookUI{
    static saveContactInfoUI(phoneBook){
        const div = document.createElement('div');

        div.classList = 'column is-3';
        div.innerHTML = `
            <div class="card">
                <div class="card-content">
                    <div class="media-content">
                        <p><i class="fas fa-star"></i></p>
                        <p class="title is-5">${phoneBook.name}</p>
                        <p class="subtitle">
                            <span>
                                <i class="fas fa-mobile-alt mx-2"></i>${phoneBook.phone}
                            </span>
                            <br>
                            <span>
                                <i class="fas fa-envelope-square mx-2"></i>${phoneBook.email}
                            </span>
                            <span hidden>${phoneBook.id}</span>
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
        try{
            const mediaContent = element.parentElement.parentElement.previousElementSibling.childNodes[1];
            // Get Name, Phone, email
            const phoneString = mediaContent.childNodes[3].nextElementSibling.childNodes[1].textContent;// GEt Phone Number From Targeted Contact Info 
            const emailString = mediaContent.childNodes[3].nextElementSibling.childNodes[1].nextElementSibling.nextElementSibling.lastChild.textContent;// GEt Email Address From Targeted Contact Info 
            const name = mediaContent.childNodes[3].textContent;// GEt Full Name From Targeted Contact Info
            const id = mediaContent.childNodes[3].nextElementSibling.childNodes[1].nextElementSibling.nextElementSibling.nextElementSibling.textContent;

            // Remove All White Space From String
            const removeSpace = (text) => text.replace(/\s+/g, '');

            const phoneNumber = removeSpace(phoneString);
            const emailAddress = removeSpace(emailString);

            // Delate Contact Info
            if(element.classList.contains('fa-trash-alt')){
                // Remove Contact Info from UI
                element.parentElement.parentElement.parentElement.parentElement.remove();
                // Delate Contact Info From Local Store
                Store.delateFromLocalStore(id);
                // Display Message
                PhoneBookUI.showMessage(`Phone Number Hasbeen Delated!`,'is-info');
            }
            // Update Contact Info From Contact List
            else if(element.classList.contains('fa-edit')){
                const textObj = new PhoneBook(name, phoneNumber, emailAddress, id);
                // Call mathod for update Contact info
                PhoneBookUI.updatePhoneBookUI(element, textObj);
            }
        }

        // Do nothing
        catch(error){
            //console.log(error);
        }
    }

    // Surch Contact Info from Contact List By Name
    static searchUI(event){
        const searchString = event.target.value.toLowerCase();
        const contactListItems = document.querySelectorAll('.column');

        contactListItems.forEach((item) => {
            const contactName = item.childNodes[1].childNodes[1].childNodes[1].childNodes[1].textContent.toLowerCase();
            if(contactName.indexOf(searchString) !== -1){
                item.classList.remove('display-none');
            }
            else{
                item.classList.add('display-none');
            }
        });
        //console.log(searchString);
    }

    // Add Contact to Favorite List
    static favoriteUI(event){
        const id = event.target.parentElement.nextElementSibling.nextElementSibling.childNodes[7].textContent;
        Store.addFavoriteLocalStore(id);
        event.target.classList.toggle('favorite');
    }

    // View Favorite
    static favoriteListUI(event){
        const starBtn = document.querySelectorAll('.fa-star');
        starBtn.forEach((star) => {
            if(star.classList.contains('favorite') === false && event.target.id === 'favorite-btn'){
                star.parentElement.parentElement.parentElement.parentElement.parentElement.classList.add('display-none');
                event.target.classList = 'is-active';
                event.target.previousElementSibling.classList.remove('is-active');
            }

            else if(event.target.id === 'all-btn'){
                star.parentElement.parentElement.parentElement.parentElement.parentElement.classList.remove('display-none');
                event.target.classList = 'is-active';
                event.target.nextElementSibling.classList.remove('is-active');
            }
        });
    }
    // Update Contact Info From Contact List
    static updatePhoneBookUI(element, textObj){
        // Get Element Column of Targeted Phone Number
        const phoneBookColumn = element.parentElement.parentElement.parentElement.parentElement;

        // Hide Targeted Contact Info View and show update view
        phoneBookColumn.childNodes[1].toggleAttribute('hidden');
        displayInfoUI.childNodes.forEach((e) => {
            e.childNodes[1] !== undefined ? e.childNodes[1].classList.toggle('display-info-disabled'): '';
        });
        phoneBookColumn.innerHTML += `
            <div class="card message is-small" id="update-info-view">
                <div class="message-header brand-bg">
                    <p><i class="fas fa-edit mx-2"></i>Edit Contact Info</p>
                    <button class="cancel-btn delete is-small" aria-label="delete"></button>
                </div>
                <form id="update-contact-form">
                    <div class="card-content">
                        <div class="media-content">
                            <p class="title is-5"><input class="input is-small" id="full-name-update" type="text" value="${textObj.name}"></p>
                            <p class="subtitle">
                                <span>
                                    <input class="input is-small" id="phone-number-update"  type="text" value="${textObj.phone}">
                                </span>
                                <br>
                                <span>
                                    <input class="input is-small" id="email-address-update" type="email" value="${textObj.email}">
                                </span>
                                <input type="hidden" id="contact-id" value="${textObj.id}">
                            </p>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <button type="submit" class="card-footer-item">
                            <i class="fas fa-save fa-gradient mx-1"></i> Update
                        </button>
                    </footer>
                </form>
            </div>
        `;

        // Close Edit Contact Info Form
        const cancelBtn = document.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', (e) => {
            e.target.parentElement.parentElement.remove();
            phoneBookColumn.childNodes[1].toggleAttribute('hidden');
            displayInfoUI.childNodes.forEach((e) => {
                e.childNodes[1] !== undefined ? e.childNodes[1].classList.toggle('display-info-disabled'): '';
            });
        })

        // Update Value In UI
        const updateContactForm = document.querySelector('#update-contact-form');
        updateContactForm.addEventListener('submit', (e) => {
            const updateName = document.querySelector('#full-name-update').value;
            const updatePhone = document.querySelector('#phone-number-update').value;
            const updateEmail = document.querySelector('#email-address-update').value;
            const contactId = document.querySelector('#contact-id').value;

            const updateContactInfo = new PhoneBook(updateName, updatePhone, updateEmail, contactId)

            phoneBookColumn.innerHTML = `
                <div class="card">
                    <div class="card-content">
                        <div class="media-content">
                            <p><i class="fas fa-star"></i></p>
                            <p class="title is-5">${updateContactInfo.name}</p>
                            <p class="subtitle">
                                <span>
                                    <i class="fas fa-mobile-alt mx-2"></i>${updateContactInfo.phone}
                                </span>
                                <br>
                                <span>
                                    <i class="fas fa-envelope-square mx-2"></i>${updateContactInfo.email}
                                </span>
                                <span hidden>${updateContactInfo.id}</span>
                            </p>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item edit"><i class="fas fa-edit fa-gradient"></i></a>
                        <a href="#" class="card-footer-item delate"><i class="fas fa-trash-alt fa-gradient"></i></a>
                    </footer>
                </div>
            `;
            // Save Update in Local Store
            Store.updateContactLocalStore(updateContactInfo);
            // Remove display-info-disabled class
            displayInfoUI.childNodes.forEach((e) => {
                e.childNodes[1] !== undefined ? e.childNodes[1].classList.remove('display-info-disabled'): '';
            });

            // Display Update Success message
            PhoneBookUI.showMessage('Phone number has been updated!','is-primary');

            e.preventDefault();
        })
        //console.log(phoneBookColumn);
        //console.table(textObj);
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

    // Add To Favorite List In Local Store
    static addFavoriteLocalStore(id){
        let phoneBook = Store.getPhoneBook();
        
        // Set favorite true if it was false, and make fals if it was true
        phoneBook.forEach((val) => {
            if(String(val.id) === id ){
                val.favorite ? val.favorite = false : val.favorite = true;
            }
        });

        localStorage.setItem('phoneBook', JSON.stringify(phoneBook));
    }

    // Make The Star Orange If Favorite True
    static is_favorite(id,star){
        let phoneBook = Store.getPhoneBook();
        
        phoneBook.forEach((val) => {
            if(String(val.id) === id ){
                val.favorite ? star.classList.add('favorite') : star.classList.remove('favorite');
            }
        });
    }

    // Update Contact Info in Local Sotre
    static updateContactLocalStore(contactInfo){
        let phoneBook = Store.getPhoneBook();
        
        phoneBook.forEach((val) => {
            if(String(val.id) === String(contactInfo.id)){
                val.name = contactInfo.name;
                val.phone = contactInfo.phone;
                val.email = contactInfo.email;
            }
        });

        localStorage.setItem('phoneBook', JSON.stringify(phoneBook));
    }

    // Delate ContactInfo From Local Store
    static delateFromLocalStore(id){
        let phoneBook = Store.getPhoneBook();

        phoneBook.forEach((val, index) => {
            if(String(val.id) === String(id)){
                phoneBook.splice(index,1);
            }
        });

        localStorage.setItem('phoneBook', JSON.stringify(phoneBook));  
    }
}

// Show Contact List When Page Is load in Screen
document.addEventListener('DOMContentLoaded', Store.displayPhoneBook());

window.addEventListener("load", () => {
    const starBtn = document.querySelectorAll('.fa-star');
    starBtn.forEach((star) => {
        const id = star.parentElement.nextElementSibling.nextElementSibling.childNodes[7].textContent
        Store.is_favorite(id, star);
    });
});

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
    // console.log(e.target);
    // console.table(phoneBook);
});

// Search Contact from list
searchInput.addEventListener('keyup', PhoneBookUI.searchUI);

// Add To Faverate
const starBtn = document.querySelectorAll('.fa-star');
starBtn.forEach((star) => {
    star.addEventListener('click',PhoneBookUI.favoriteUI);
});

// Add Event Listener in favoriteBtn
panelTabsBtn.addEventListener('click',PhoneBookUI.favoriteListUI);

// Delate Or Update Contact From Contact List
contactList.addEventListener('click', (e) => {
    // Remove Or Update From UI And Local Store Or Update
    PhoneBookUI.getTargetContactUI(e.target);
});
