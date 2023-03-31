# Kubectl plugin - multins

This ```kubectl``` supports the following custom ```multins``` command.

## Custom helm commands

```
kubectl multins --code --namespaces NAMESPACE1,NAMESPACE1 ....
```

comma separated (no space before or after commas) set of some of these options all, hooks, manifest, notes, values, templates

--code option specifies to use VSCode to show the output

TIP: To avoid passing --namespaces parameter every time, you can set an environment variable MULTINS_NAMESPACES with the comma separated list of namespaces you want to use.

## Building

```
npm install
npm run pkg
```

## Use it locally

- Add the ```dist/YOURPLATFORM/bin``` folder to your PATH variable.

- Confirm that ``kubectl``` is able to see the plugin by doing the following:

```
kubectl plugin list
```

- Invoke the plugin as shown above.


## Installation of the plugin

Once the plugin is available on [krew-index](), install it like this:

```
kubectl krew install multins
```
