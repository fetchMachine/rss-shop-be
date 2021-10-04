import * as yup from 'yup';

import { NewProduct } from '@providers/products';

export const productSchema: yup.SchemaOf<NewProduct> = yup.object().shape({
  description: yup.string().required(),
  price: yup.number().required().positive().integer(),
  count: yup.number().required().positive().integer(),
  title: yup.string().required(),
});
