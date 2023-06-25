// Função para lidar com o clique no ícone "Delete"
function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
      fetch(`/delete/${userId}`, { method: 'DELETE' })
        .then(response => {
          if (response.ok) {
            // Recarrega a página para exibir a lista atualizada de usuários
            window.location.reload();
          } else {
            console.log(userId)
            throw new Error('Failed to delete user');
          }
        })
        .catch(error => {
          console.error(error);
          alert('An error occurred while deleting the user.');
        });
    }
  }

  // Obtém todos os elementos com a classe "delete-user"
  const deleteButtons = document.querySelectorAll('.delete-user');

  // Adiciona um ouvinte de eventos para cada botão de exclusão
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const userId = button.getAttribute('data-user-id');
      deleteUser(userId);
    });
  });