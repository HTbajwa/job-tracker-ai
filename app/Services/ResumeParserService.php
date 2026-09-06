<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Smalot\PdfParser\Parser;

class ResumeParserService
{
    /**
     * Extract plain text from an uploaded PDF resume.
     */
    public function extractText(UploadedFile $file): string
    {
        $parser = new Parser();
        $pdf = $parser->parseFile($file->getRealPath());

        return trim($pdf->getText());
    }
}