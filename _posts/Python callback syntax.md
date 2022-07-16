# Python callback syntax

Python doesn’t have the convention of inline function declarations. It’s pretty messy to do, normally looks like this:

	button = Button()
	
	def callback():
	    print('Button was pressed!')
	
	button.on_press = callback

But it’s not commonly used, because you have to read the code from back to front. Many people have asked Python for a ‘multi-line lambda’ over the years, but it has never been added.

There is a way to use decorator syntax to design this API a little nicer. It looks like

	button = Button()
	
	@button.on_press
	def on_press():
	    print('Button was pressed!')

This is much better, but it has some problems:
- you have to specify a function name, despite the fact that the name isn’t used anywhere
- the API must add support for this decorator style, which is very unpythonic when used directly `button.on_press(callback)`. The pythonic API would be `button.on_press = callback`, but this doesn’t allow the decorator style.

## Proposal

This is my suggestion:

	button = Button()
	
	def button.on_press():
	    print('Button was pressed!')

This has some nice properties:

- the function name says where a reference to this function should be stored. This is exactly the same as normal named functions, where the function is available at that name, once it’s been declared.
- the syntax in unambiguous - the parser just looks for an expression lvalue until the first open bracket.
- the code is read from top to bottom again - much easier to read than the current example
- no temporary function name needed
- no extra API changes needed - the same API `button.on_press = callback` can be used in both methods.