import gql from "graphql-tag";

export default function query(param) {
    return gql`
    query {
        recipes(where:{category:"${param}"}){
          id
          timeText
          calories
          recipeCaption
          recipeDescription
          recipeImage{
            url
          }
          category
          products {
            productName
          }
        }
        categories{
            id
            categoryName
            categoryImage{
                url
            }
            categoryDisplayNameUA
        }
        categoriesTexts{
          CategoryNameText
          CategoryText
        }
        products{
          productCaption
          productName
          productCalories
          productProteins
          productFats
          productCarbohydrates
          icon{
            url
          }
          category
        }
        categoriesProducts{
          categoryProductName
          categoryProductDisplayNameUA
        }   
    }`
}