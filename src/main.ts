import tailwind from './tailwind.json'

function deleteTailwindCollections() {
  const collections = figma.variables.getLocalVariableCollections();
  for (const collection of collections) {
    if (collection.name === "Tailwind") {
      collection.remove();
      console.log(`Deleted collection: ${collection.name}`);
    }
  }
}

function createColorVariable(name: string, value: string, collection: VariableCollection, mode: { modeId: string }) {
  const variable = figma.variables.createVariable(
    `color/${name}`,
    collection,
    'COLOR'
  );

  variable.setValueForMode(mode.modeId, figma.util.rgb(value))
}

type ColorObject = {
  [key: string]: string | { [key: string]: string }
}


function createColorVariablesFromObject(object: ColorObject, collection: VariableCollection, mode: { modeId: string }) {
  Object.entries(object).forEach(([name, value]): void => {
    if (typeof value === 'string') {
      createColorVariable(name, value, collection, mode)
      return
    }


    Object.entries(value).forEach(([key, value]): void => {
      createColorVariable(`${name}/${key}`, value, collection, mode)
    })
  })
}

function createSpacingVariables(collection: VariableCollection, mode: { modeId: string }) {
  const baseSpacing = 4

  for (let i = 0; i <= 100; i++) {
    const spacing = baseSpacing * i
    const spacingName = `spacing/${i}`
    const variable = figma.variables.createVariable(
      spacingName,
      collection,
      'FLOAT'
    )

    variable.setValueForMode(mode.modeId, spacing)
    
  }
}

export default function (): void {
  deleteTailwindCollections();


  const collection = figma.variables.createVariableCollection('Tailwind');
  const mode = collection.modes[0]

  const colors = tailwind.colors
  createColorVariablesFromObject(colors, collection, mode)

  createSpacingVariables(collection, mode)
  
  figma.closePlugin('Collection created')
}
