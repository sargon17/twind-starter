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

function createVariable(prefix: string, name: string, value: string | number, collection: VariableCollection, mode: { modeId: string }, type: 'BOOLEAN' | 'COLOR' | 'FLOAT' | 'STRING') {
  let val: string | number | RGB = value 
  if (type === 'COLOR' && typeof value === 'string') {
    val = figma.util.rgb(value)
  }
  const variable = figma.variables.createVariable(
    `${prefix}/${name}`,
    collection,
    type
  );

  variable.setValueForMode(mode.modeId, val)
}

type ColorObject = {
  [key: string]: string | { [key: string]: string }
}


function createColorVariablesFromObject(object: ColorObject, collection: VariableCollection, mode: { modeId: string }) {
  Object.entries(object).forEach(([name, value]): void => {
    if (typeof value === 'string') {
      createVariable("color", name, value, collection, mode, 'COLOR')
      return
    }


    Object.entries(value).forEach(([key, value]): void => {
      createVariable(`color/${name}`, key, value, collection, mode, 'COLOR')
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



function createVariablesFromObject(prefix: string, object: { [key: string]: number | string }, collection: VariableCollection, mode: { modeId: string }, type: 'BOOLEAN' | 'COLOR' | 'FLOAT' | 'STRING') {
  Object.entries(object).forEach(([name, value]): void => {
    createVariable(prefix, name, value, collection, mode, type)
  })
}

export default function (): void {
  deleteTailwindCollections();


  const collection = figma.variables.createVariableCollection('Tailwind');
  const mode = collection.modes[0]

  createColorVariablesFromObject(tailwind.colors, collection, mode)
  createSpacingVariables(collection, mode)
  createVariablesFromObject('blur', tailwind.blur, collection, mode, 'FLOAT')
  figma.closePlugin('Collection created')
}
