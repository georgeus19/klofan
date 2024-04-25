workspace {

    model {
        user = person "User" "Wants to transform data to RDF"
        admin = person "Administrator"
        softwareSystem = softwareSystem "Klofan" "My software system." {

            catalogContainer = container "Catalog" "Manages datasets and notifies analyzers."
            uploadRecordsStore = container "Dataset Triplestore" "Stores Datasets (metadata)." "Virtuoso"

            group Recommenders {
                recommendersContainer = container "Recommender" "Provides recommendations based on editor data and analyses." {
                    recommendersComponent = component "Recommender" "Provides recommendations based on editor data and analyses."
                    analyzersComponent = component "Analyzer" "Performs analysis on dataset data to create analyses."
                }
            }

            group "Analyses Stores" {
                recommendationsIndexStoreContainer = container "Recommendation Analyses Store" "Stores analyses." "MongoDB"
            }

            editorContainer = container "Editor" "Provides transformation environment to transform structured data to RDF."

        }

        user -> editorContainer "Transform data to RDF"
        admin -> catalogContainer "Upload datasets"

        catalogContainer -> uploadRecordsStore "Store uploaded datasets"
        catalogContainer -> analyzersComponent "Send datasets to analyze"

        analyzersComponent -> recommendationsIndexStoreContainer "Store analyses"
        analyzersComponent -> catalogContainer "Send analysis provenance"

        recommendersComponent -> recommendationsIndexStoreContainer "Access analyses"

        editorContainer -> recommendersComponent "Get recommendations"
    }

    views {

        container softwareSystem "SystemContainerView" {
            include *
        }

        component recommendersContainer "RecommendersComponentView" {
            include *
        }

        

     styles {
        element "Element" {
            fontSize 32
        }

        relationship "Relationship" {
            fontSize 30
        }

        element "Group" {
            fontSize 30
        }

           element "Existing System" {
                background #999999
            }

    }

        

    theme default

    }
    
}