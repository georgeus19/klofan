workspace {

    model {

        user = person "User" "Wants to transform data to RDF"
        admin = person "Administrator"

        softwareSystem = softwareSystem "Klofan" "Klofan software system." {

            catalogContainer = container "Catalog" "Manages datasets and notifies analyzers."
            catalogStore = container "Dataset Triplestore" "Stores datasets (metadata)." "Virtuoso"

            analyzerManagerContainer = container "Analyzer Manager" "Manages analyzers and saves their analyses and their metadata."

            group "Analysis Job Queues" {
                analyzerQueueContainer = container "Analysis Job Queue" "Queues jobs to analyze datasets." "Redis"
            }

            group Analyzers {
                analyzerContainer = container "Analyzer" "Performs analysis on dataset data to create analyses."
            }

            analysisStoreContainer = container "Analyses Store" "Stores analyses and provides access to them."
            analysesDatabaseContainer = container "Analyses Database" "Stores analyses." "MongoDB"
 
            recommenderManagerContainer = container "Recommender Manager" "Manage recommenders for recommending in editor."
            group Recommenders {
                recommenderContainer = container "Recommender" "Provides recommendations based on editor data and analyses."
            }

            editorContainer = container "Editor" "Provides transformation environment to transform structured data to RDF."
        }

        user -> editorContainer "Transform data to RDF"
        admin -> catalogContainer "Upload datasets"

        catalogContainer -> catalogStore "Store uploaded datasets"
        catalogContainer -> analyzerManagerContainer "Send datasets to analyze"

        analyzerManagerContainer -> analyzerQueueContainer "Send analysis jobs to every queue"
        analyzerContainer -> analyzerQueueContainer "Get Analysis Jobs"
        analyzerContainer -> analysisStoreContainer  "Store analyses"
        analysisStoreContainer -> analysesDatabaseContainer "Store analyses"

        editorContainer -> recommenderManagerContainer "Gets recommendations"
        recommenderManagerContainer -> recommenderContainer "Get recommendations"
        recommenderContainer -> analysisStoreContainer "Get analyses"

    }

    views {

        container softwareSystem "SystemContainerView" {
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