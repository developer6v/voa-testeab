
        document.getElementById('validationForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const submitBtn = document.getElementById('submitBtn');
            const loading = document.getElementById('loading');
            const errorMessage = document.getElementById('errorMessage');
            
            // Limpar mensagens de erro anteriores
            errorMessage.style.display = 'none';
            
            // Validar email
            if (!email || !isValidEmail(email)) {
                showError('Por favor, insira um email válido.');
                return;
            }
            
            // Mostrar loading
            submitBtn.disabled = true;
            submitBtn.textContent = 'Verificando...';
            loading.style.display = 'block';
            
            try {
                // Criar FormData para enviar o email como parâmetro
                const formData = new FormData();
                formData.append('email', email);
                
                // Fazer requisição POST para a API
                const response = await fetch('https://script.google.com/macros/s/AKfycbzjCaODfmxJ9MfiND3vykaOuMGlle8-_iy4Fbk7mkqMLJhefiFSD6u77wLfNh2nMPW2Fg/exec', {
                    method: 'POST',
                    body: formData
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.text();
                const resultTrimmed = result.trim().toLowerCase();
                
                console.log('Resposta da API:', result); // Para debug
                
                if (resultTrimmed === 'true') {
                    // Compra encontrada - redirecionar para checkout
                    // Aguardar um momento para mostrar feedback visual
                    submitBtn.textContent = 'Compra encontrada! Redirecionando...';
                    setTimeout(() => {
                        window.location.href = 'https://checkout.hotmart.com/seu-link-aqui'; // Substituir pela URL real do checkout
                    }, 1500);
                } else if (resultTrimmed === 'false') {
                    // Compra não encontrada - redirecionar para página de não encontrado
                    submitBtn.textContent = 'Compra não encontrada. Redirecionando...';
                    setTimeout(() => {
                        window.location.href = 'pagina-nao-encontrado.html'; // Substituir pela página real
                    }, 1500);
                } else {
                    // Resposta inesperada
                    throw new Error('Resposta inesperada da API: ' + result);
                }
                
            } catch (error) {
                console.error('Erro na requisição:', error);
                showError('Erro ao verificar compra. Verifique sua conexão e tente novamente.');
                
                // Restaurar estado do botão em caso de erro
                submitBtn.disabled = false;
                submitBtn.textContent = 'Verificar Compra';
                loading.style.display = 'none';
            }
        });
        
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        function showError(message) {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }
        
        // Limpar erro quando usuário começar a digitar
        document.getElementById('email').addEventListener('input', function() {
            document.getElementById('errorMessage').style.display = 'none';
        });
        
        // Adicionar Enter key support
        document.getElementById('email').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                document.getElementById('validationForm').dispatchEvent(new Event('submit'));
            }
        });