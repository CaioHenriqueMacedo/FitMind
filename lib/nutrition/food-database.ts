export interface FoodItem {
  id: string;
  name: string;
  calories: number; // per 100g
  protein: number;  // per 100g
  carbs: number;    // per 100g
  fat: number;      // per 100g
  unit: string;     // 'g' or 'unit'
  defaultQuantity: number;
}

export const COMMON_FOODS: FoodItem[] = [
  { id: "1", name: "Arroz Branco Cozido", calories: 130, protein: 2.7, carbs: 28, fat: 0.3, unit: "g", defaultQuantity: 100 },
  { id: "2", name: "Arroz Integral Cozido", calories: 111, protein: 2.6, carbs: 23, fat: 0.9, unit: "g", defaultQuantity: 100 },
  { id: "3", name: "Feijão Carioca Cozido", calories: 76, protein: 4.8, carbs: 14, fat: 0.5, unit: "g", defaultQuantity: 100 },
  { id: "4", name: "Peito de Frango Grelhado", calories: 165, protein: 31, carbs: 0, fat: 3.6, unit: "g", defaultQuantity: 100 },
  { id: "5", name: "Ovo Cozido", calories: 155, protein: 13, carbs: 1.1, fat: 11, unit: "unit", defaultQuantity: 1 },
  { id: "6", name: "Banana Prata", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, unit: "unit", defaultQuantity: 1 },
  { id: "7", name: "Maçã Fuji", calories: 52, protein: 0.3, carbs: 14, fat: 0.2, unit: "unit", defaultQuantity: 1 },
  { id: "8", name: "Pão Francês", calories: 300, protein: 8, carbs: 58, fat: 3, unit: "unit", defaultQuantity: 1 },
  { id: "9", name: "Carne Moída (Patinho)", calories: 219, protein: 35.9, carbs: 0, fat: 7.3, unit: "g", defaultQuantity: 100 },
  { id: "10", name: "Batata Doce Cozida", calories: 86, protein: 1.6, carbs: 20, fat: 0.1, unit: "g", defaultQuantity: 100 },
  { id: "11", name: "Tapioca pronta", calories: 240, protein: 0.4, carbs: 60, fat: 0.1, unit: "g", defaultQuantity: 100 },
  { id: "12", name: "Cuscuz de Milho", calories: 112, protein: 2.3, carbs: 25, fat: 0.2, unit: "g", defaultQuantity: 100 },
  { id: "13", name: "Whey Protein (concentrado)", calories: 390, protein: 80, carbs: 6, fat: 7, unit: "g", defaultQuantity: 30 },
  { id: "14", name: "Queijo Minas Frescal", calories: 243, protein: 17, carbs: 3.2, fat: 18, unit: "g", defaultQuantity: 30 },
  { id: "15", name: "Pasta de Amendoim", calories: 588, protein: 25, carbs: 20, fat: 50, unit: "g", defaultQuantity: 15 },
];
