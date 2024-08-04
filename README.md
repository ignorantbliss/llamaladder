# llamaladder
Converts ladder-logic JSON descriptions from LLM models to interactive SVG images

## Intention
This library converts a JSON description of ladder-logic that comes from an LLM model (such as Llama3.1) into an interactive, SVG-based ladder-logic drawing. This makes descriptions of ladder logic much more accessible than the text-based diagrams produced by LLMs, and gives you the ability to immediately test the generated logic.

## Example
Some examples are [available here](https://ignorantbliss.github.io/llamaladder/examples/)

## Prompt Engineering
If you're trying to get the LLM to create PLC-compatibile logic, you might need to add some instructions as part of your prompt.

Llama3/3.1 will often assume that your ladder logic retains the previous value of an output or has the ability to set outputs zero or 'toggle' them. To avoid this behaviour, try the following statement...

"Outputs can be latched on and off, but can't be toggled or directly turned off. Show all ladder logic in JSON format."

## Using
To use the library, you'll need to import the Javascript file **llamaladder.js**.

Then, add an **SVG** element to your web page with an ID.

Finally, at some point in your Javascript, create a LadderLogic object and pass it the decoded JSON object to translate, and the selector that returns the SVG file you want to draw onto.

```
<script>
	ll = new LadderLogic();
	ll.parse(my_json,'#mysvgid');		
	ll.makeInteractive();
</script>
```

## Interactivity

If you include a call to **makeInteractive**, buttons will be added that allow you to left-click to turn inputs on and/or off. If you want to __hold__ an input down, click on the button and drag out of the button before releasing.

## Status
This code is currently just a working sketch - you're welcome to play with it, adapt it etc, but it's not particularly efficient or well-tested at the current point in time.
