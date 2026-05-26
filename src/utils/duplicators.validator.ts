import { registerDecorator, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";


// Validador personalizado para verificar duplicatas no array fields com base em um atributo
@ValidatorConstraint({ name: 'uniqueFieldsByAttribute', async: false })
export class UniqueFieldsByAttributeConstraint implements ValidatorConstraintInterface {
  validate(fields: any[], args: ValidationArguments) {
    if (!fields || !Array.isArray(fields)) return true; // Se fields for undefined ou vazio, passa na validação (já que é @IsOptional)

    // Obtém o nome do atributo a partir das constraints
    const [attribute] = args.constraints;
    if (!attribute) return false; // Falha se nenhum atributo for especificado

    // Extrai os valores do atributo especificado
    const values = fields.map((field) => field[attribute as keyof any]);
    // Verifica se há duplicatas comparando o tamanho do array com o tamanho de um Set
    const uniqueValues = new Set(values);
    return uniqueValues.size === values.length; // Retorna true se não houver duplicatas
  }

  defaultMessage(args: ValidationArguments) {
    const [attribute] = args.constraints;
    return `The fields array contains duplicate values for ${attribute}`;
  }
}

// Decorador personalizado para usar o validador com um atributo específico
export function IsUniqueFieldsByAttribute(attribute: string, validationOptions?: any) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isUniqueFieldsByAttribute',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [attribute],
      options: validationOptions,
      validator: UniqueFieldsByAttributeConstraint,
    });
  };
}