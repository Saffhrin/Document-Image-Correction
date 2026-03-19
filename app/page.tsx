import { Header } from "@/components/header";
import { DocumentProcessor } from "@/components/document-processor";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DocumentProcessor />
      </main>
      <footer className="border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-muted-foreground text-center">
            DocuScan Pro - Document Image Correction and Readability Enhancement
          </p>
        </div>
      </footer>
    </div>
  );
}
