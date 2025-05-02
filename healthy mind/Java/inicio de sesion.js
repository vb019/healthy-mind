document.addEventListener('DOMContentLoaded', function() {
    // Lamado de documentos
    const signUp = document.getElementById('signUp');
    const signIn = document.getElementById('signIn');
    const nombreBox = document.getElementById('nombre');
    const termsBox = document.getElementById('terms-box');
    const title = document.getElementById('titulo');
    const submitBtn = document.getElementById('submit-btn');
    const loginForm = document.getElementById('loginForm');

    // terminos y condiciones
    const termsLink = document.getElementById('terms-open');
    const termsModal = document.getElementById('terms-modal');
    const modalClose = document.getElementById('modal-close');
    const acceptTerms = document.getElementById('accept-terms');
    const termsCheck = document.getElementById('terms');
    
    // Estado inicial - Inicio de sesión
    let isRegistrationMode = false;
    
    // Función para cambiar al modo de registro
    signUp.onclick = function() {
        if (isRegistrationMode) return;
        
        // Cambiar a modo registro
        isRegistrationMode = true;
        title.textContent = 'Registro';
        submitBtn.textContent = 'Registrarme';
        
        // Mostrar campos adicionales
        nombreBox.classList.remove('hidden');
        termsBox.classList.remove('hidden');
        
        // Actualizar botones
        signUp.classList.add('disable');
        signIn.classList.remove('disable');
        
        // Actualizar requisitos del formulario
        document.getElementById('terms').setAttribute('required', 'required');
        document.getElementById('nombre').setAttribute('required', 'required');
    }
    
    // Función para cambiar al modo de inicio de sesión
    signIn.onclick = function() {
        if (!isRegistrationMode) return;
        
        // Cambiar a modo inicio de sesión
        isRegistrationMode = false;
        title.textContent = 'Iniciar Sesión';
        submitBtn.textContent = 'Iniciar sesión';
        
        // Ocultar campos
        nombreBox.classList.add('hidden');
        termsBox.classList.add('hidden');
        
        // Actualizar botones
        signUp.classList.remove('disable');
        signIn.classList.add('disable');
        
        // Actualizar requisitos del formulario
        document.getElementById('terms').removeAttribute('required');
        document.getElementById('nombre').removeAttribute('required');
    }
    
    
    // Validación y envío del formulario
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Aquí irá la lógica para enviar los datos
        if (isRegistrationMode) {
            alert('Formulario de registro enviado');
            // Aquí se llamaría a una API de registro
        } else {
            alert('Iniciando sesión');
            // Aquí se llamaría a una API de inicio de sesión
        }
    });  

    // Mostrar modal de términos y condiciones
    termsLink.addEventListener('click', function(e){ //cuando le de click al link abrir el modal
        e.preventDefault();
        termsModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Deshabilitar scroll del body
    });

    // Cerrar modal de términos y condiciones cuando le de en la X
    modalClose.addEventListener('click', function(){
        termsModal.classList.remove('active');
        document.body.style.overflow = ''; // Habilitar scroll del body

    });

    //cerrar modal cuando de click fuera del modal
    termsModal.addEventListener('click', function(e){
        if (e.target === termsModal) {
            termsModal.classList.remove('active');
            document.body.style.overflow = ''; // Habilitar scroll del body
        }
    });

    acceptTerms.addEventListener('click', function(){
        termsCheck.checked = true;
        termsModal.classList.remove('active');
        document.body.style.overflow = ''; // Habilitar scroll del body
    });
    
});