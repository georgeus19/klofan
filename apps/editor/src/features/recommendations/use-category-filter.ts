import { useState } from 'react';
import { IdentifiableRecommendation } from '@klofan/recommender/recommendation';
import * as _ from 'lodash';

export type Category = {
    name: string;
};

export type CategoryFilter = {
    selectedCategory: Category | null;
    categories: Category[];
    selectCategory: (category: Category) => void;
    removeCategory: (category: Category) => void;
    updateCategories: (recommendations: IdentifiableRecommendation[], keepOld: boolean) => void;
};

export function useCategoryFilter(): CategoryFilter {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    const selectCategory = (category: Category) => {
        setSelectedCategory(category);
    };

    const removeCategory = (category: Category) => {
        setSelectedCategory(null);
    };

    const updateCategories = (recommendations: IdentifiableRecommendation[], keepOld: boolean) => {
        const newCategories = _.uniq(
            Object.values(recommendations).map((r) => r.category.name)
        ).map((name) => ({ name }));

        if (keepOld) {
            setCategories((prevCategories) =>
                _.uniqWith([...prevCategories, ...newCategories], (a, b) => a.name === b.name)
            );
        } else {
            setSelectedCategory(null);
            setCategories(newCategories);
        }
    };

    // console.log(categories);

    return {
        selectedCategory,
        categories,
        selectCategory,
        removeCategory,
        updateCategories,
    };
}
