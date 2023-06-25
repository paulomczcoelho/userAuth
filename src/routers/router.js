router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
      await createUser(name, email, password);
      res.redirect('/login');
    } catch (error) {
      console.log(error);
      res.render('register', { messages: { error: 'Error creating user' } });
    }
  });